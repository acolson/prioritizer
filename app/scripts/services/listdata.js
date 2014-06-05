'use strict';

angular.module('priorisaurusApp')
  .factory('ListData', function () {
    var dmaList = [
      {
        id: 1,
        name: 'Detroit',
        sites: 28,
        priority: null
      },
      {
        id: 2,
        name: 'New York',
        sites: 97,
        priority: null
      },
      {
        id: 3,
        name: 'Los Angeles',
        sites: 533,
        priority: null
      },
      {
        id: 4,
        name: 'Seattle',
        sites: 42,
        priority: null
      },
      {
        id: 5,
        name: 'Chicago',
        sites: 2,
        priority: null
      },
      {
        id: 6,
        name: 'San Francisco',
        sites: 84,
        priority: null
      },
      {
        id: 7,
        name: 'Philadelphia',
        sites: 2345,
        priority: null
      },
      {
        id: 8,
        name: 'Dallas',
        sites: 329,
        priority: null
      },
      {
        id: 9,
        name: 'Boston',
        sites: 72,
        priority: null
      },
      {
        id: 10,
        name: 'Denver',
        sites: 57,
        priority: null
      },
      {
        id: 11,
        name: 'Washinton DC',
        sites: 9,
        priority: null
      },
      {
        id: 12,
        name: 'Snoqualmie',
        sites: 8,
        priority: null
      },
      {
        id: 13,
        name: 'Atlanta',
        sites: 93,
        priority: null
      },
      {
        id: 14,
        name: 'Nashville',
        sites: 24,
        priority: null
      },
      {
        id: 15,
        name: 'Alpena',
        sites: 216,
        priority: null
      },
      {
        id: 16,
        name: 'St. Louis',
        sites: 7,
        priority: null
      },
      {
        id: 17,
        name: 'Pheonix',
        sites: 32,
        priority: null
      },
      {
        id: 18,
        name: 'Las Vegas',
        sites: 12,
        priority: null
      },
      {
        id: 19,
        name: 'Portland',
        sites: 5,
        priority: null
      },
      {
        id: 20,
        name: 'Toledo',
        sites: 1,
        priority: null
      }
    ];

    return dmaList;
  });
