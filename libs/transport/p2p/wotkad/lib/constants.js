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

var ms = require('ms');

/**
* Protocol constants
* #exports
* @see http://xlattice.sourceforge.net/components/protocol/kademlia/specs.html#constants
*/
module.exports = {

  ALPHA: 3,
  B: 160,
  K: 20,

  T_REFRESH: ms('3600s'),
  T_REPLICATE: ms('3600s'),
  T_REPUBLISH: ms('86400s'),

  // T_EXPIRE is 5s higher than protocol spec to avoid republish race condition
  T_EXPIRE: ms('86405s'),

  T_RESPONSETIMEOUT: ms('100s'),

  MESSAGE_TYPES: [
    'PING',
    'PONG',
    'STORE',
    'STORE_REPLY',
    'FIND_NODE',
    'FIND_NODE_REPLY',
    'FIND_VALUE',
    'FIND_VALUE_REPLY'
  ]

};
