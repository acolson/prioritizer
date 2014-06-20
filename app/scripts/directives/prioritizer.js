'use strict';

angular.module('priorisaurusApp')
  .directive('triggerLoad', function () {
    return {
      link: function postLink(scope, el) {
        el.attr('draggable', true);
        $('[prioritizer]').triggerHandler('dragload', el);
      }
    };
  })

  .directive('prioritizer', function ($http, $compile, _) {
    return {
      templateUrl: function (el, attrs) {
        return attrs.templateUrl;
      },
      scope: {
        source: '=',
        sort: '=',
        reverse: '=',
        exportName: '=',
        droplistClass: '=',
        droplistOverClass: '=',
        draggingClass: '='
      },
      restrict: 'A',
      link: {

        // Before child compilation
        pre: function preLink(scope) {
          var url;

          // source is a url if a string.
          if (typeof(scope.source) === 'string') {
            url = scope.source.replace(/\'/g, '');

            $http({method: 'GET', url: url})
            .success(function (data) {
              scope.data = data;
            });

          } else {
            scope.data = scope.source;
          }
        },

        // After child compilation
        post: function postLink(scope, el) {
          var $dragSrcEl,
              $dropList = $('[ng-class="droplistClass"]'),
              $placeholder = $('<li class="placeholder"></li>');

          scope.priorities = _.chain(scope.data)
            .where(function (item) {
              return (item.priority !== null && item.priority >= 0);
            })
            .sortBy('priority')
            .value();

          scope.$watch('priorities', function () {
            getExportList();
          }, true);


          /*
           *
           * Utilities
           *
           */

          var stopProp = function stopProp(e) {
            if (e.stopPropagation) {
              e.stopPropagation();
            }
          };

          var getExportList = function getExportList() {
            var exportList = [];
            _.forEach(scope.priorities, function (priority) {
              exportList.push(priority.id);
            });
            scope.exportList = exportList.join(',');
            return scope.exportList;
          };

          var updatePriorities = function updatePriorities($el) {
            var $elScopeItem = $el.scope().item;
            $dropList.children(':not(.placeholder)').each(function (index) {
              var $this = $(this),
                  scopeItem = $this.scope().item;

              scopeItem.priority = index;

              if ($this.is('.hidden')) {
                $elScopeItem = scopeItem;
                $this.remove();
              }

            });

            scope.priorities = _.sortBy(scope.priorities, 'priority');
            if ($el) el.triggerHandler('priorityUpdate', $elScopeItem);
          };

          var copyScope = function copyScope(scopeItem) {
            var priorityIndex = scope.priorities.length,
                priorityObj = scope.priorities[priorityIndex] = {};

            scopeItem.priority = priorityIndex;
            return angular.copy(scopeItem, priorityObj);
          };

          /*
           *
           * Element Functions
           *
           */

          scope.removePriority = function removePriority() {
            _.find(scope.data, {id: this.item.id}).priority = null;
            _.remove(scope.priorities, {id: this.item.id});
          };

          scope.pushPriority = function pushPriority (direction, e) {
            var $el = $(e.target).parent();
            if (direction === 'up') {
              $el.parent().prepend($el);
            } else if (direction === 'down') {
              $el.parent().append($el);
            }
            updatePriorities($el);
          };


          /*
           *
           * Handlers
           *
           */

          var start = function start() {
            $dragSrcEl = $(this);
            $dragSrcEl.addClass(scope.draggingClass);
          };

          var end = function end() {
            $(this).removeClass(scope.draggingClass);
            $dropList.removeClass(scope.droplistOverClass); // so it doesn't get 'stuck'
            $dragSrcEl.show();
            $placeholder.detach();
          };

          var enter = function enter() {
            var $this = $(this);
            if ($this.is($dropList)) {
              $this.addClass(scope.droplistOverClass);
            } else {
              $dragSrcEl.hide();
              // trick borrowed from Farhadi's html5sortable plugin
              // https://github.com/farhadi/html5sortable
              $this[$placeholder.index() < $this.index() ? 'after' : 'before']($placeholder);
            }
          };

          var leave = function leave() {
            $(this).removeClass(scope.droplistOverClass);
          };

          // Drag hovering on element.
          var over = function over(e) {
            if (e.preventDefault) {
              e.preventDefault();
            }
            return false;
          };

          // Element move
          var move = function move(e) {
            stopProp(e);

            var $el,
                $this = $(this),
                scopeItem = $dragSrcEl.scope().item;

            if ($this.is($dropList)) {
              var duplicate;

              _.forEach(scope.priorities, function (priority) {
                duplicate = priority.id === scopeItem.id ? true : duplicate;
              });

              if (!duplicate) {
                el.triggerHandler('priorityUpdate', copyScope(scopeItem));
              }

            } else {
              if (!scopeItem.priority) {
                var newScope = scope.$new();
                newScope.item = copyScope(scopeItem);

                // TODO: This clone is jank, need to find a better way to update priorities.
                // TODO: this may also be causing some jitter on the add.
                $el = $dragSrcEl
                  .clone()
                  .addClass('hidden')
                  .removeAttr('ng-hide ng-repeat');

                $compile($el)(newScope).insertBefore($placeholder);
              } else {
                $el = $($dragSrcEl.insertBefore($placeholder));
              }
              updatePriorities($el);
            }

            scope.$apply();

            return false;
          };


          /*
           *
           * Initial event attachment
           *
           */

          el.on('dragload', function (e, item) {
            var $item = $(item);

            $item.on({
              'dragstart': start,
              'dragend': end,
            });

            if ($item.is('.priority')) {
              $item.on({
                'dragenter': enter,
                'drop': move
              });
            }
          });

          $dropList.on({
            'dragenter': enter,
            'dragleave': leave,
            'dragover': over,
            'drop': move
          });

          $placeholder.on({
            'drop': move
          });

          el.on('priorityUpdate', function(e, s){
            console.log(s);
          });
        }
      }
    };
  });
