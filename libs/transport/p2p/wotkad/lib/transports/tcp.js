/*
 
This file is part of W3C Web-of-Things-Framework.

W3C Web-of-Things-Framework is an open source project to create an Internet of Things framework.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by 
the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

W3C Web-of-Things-Framework is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with W3C Web-of-Things-Framework.  If not, see <http://www.gnu.org/licenses/>.
 
File created by Tibor Zsolt Pardi

Copyright (C) 2015 The W3C WoT Team
 
*/

'use strict';

var inherits = require('util').inherits;
var clarinet = require('clarinet');
var net = require('net');
var AddressPortContact = require('./address-port-contact');
var Message = require('../message');
var RPC = require('../rpc');
var utils = require('../utils');

inherits(TCPTransport, RPC);

/**
* Represents an RPC interface over TCP
* @constructor
* @param {object} options
*/
function TCPTransport(options) {
  if (!(this instanceof TCPTransport)) {
    return new TCPTransport(options);
  }

  var self = this;

  RPC.call(this, options);

  this._socket = net.createServer(this._handleConnection.bind(this));

  this._socket.on('error', function(err) {
    var contact = self._contact;
    self._log.warn('failed to bind to supplied address %s', contact.address);
    self._log.info('binding to all interfaces as a fallback');
    self._socket.close();

    self._socket = net.createServer(self._handleConnection.bind(self));

    self._socket.listen(contact.port);
  });

  this._socket.on('listening', function() {
    self.emit('ready');
  });

  this._socket.listen(this._contact.port, this._contact.address);
}

/**
* Create a TCP Contact
* #_createContact
* @param {object} options
*/
TCPTransport.prototype._createContact = function(options) {
  return new AddressPortContact(options);
};

/**
* Send a RPC to the given contact
* #_send
* @param {buffer} data
* @param {Contact} contact
*/
TCPTransport.prototype._send = function(data, contact) {
  var self = this;
  var sock = net.createConnection(contact.port, contact.address);

  sock.on('error', function(err) {
    self._log.error('error connecting to peer', err);
  });

  sock.end(data);
};

/**
* Close the underlying socket
* #_close
*/
TCPTransport.prototype._close = function() {
  this._socket.close();
};

/**
* Handle incoming connection
* #_handleConnection
* @param {object} socket
*/
TCPTransport.prototype._handleConnection = function(socket) {
  var self = this;
  var addr = socket.remoteAddress;
  var port = socket.remotePort;
  var parser = clarinet.createStream();
  var buffer = '';
  var opened = 0;
  var closed = 0;

  this._log.info('connection opened with %s:%s', addr, port);

  parser.on('openobject', function(key) {
    opened++;
  });

  parser.on('closeobject', function() {
    closed++;

    if (opened === closed) {
      self._handleMessage(new Buffer(buffer), { address: addr, port: port });

      buffer = '';
      opened = 0;
      closed = 0;
    }
  });

  parser.on('error', function(err) {
    socket.close();
  });

  socket.on('error', function(err) {
    self._log.error('error communicating with peer %s:%s', addr, port);
  });

  socket.on('data', function(data) {
    buffer += data.toString('utf8');
    parser.write(data.toString('utf8'));
  });
};

module.exports = TCPTransport;
