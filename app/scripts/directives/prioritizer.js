'use strict';

angular.module('priorisaurusApp')
  .directive('triggerLoad', function () {
    return {
      link: function postLink(scope, el) {
        el.attr('draggable', true);
        $('#prioritizer').trigger('dragload', el);
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
        exportName: '='
      },
      restrict: 'E',
      replace: true,
      link: {
        pre: function preLink(scope) {
          var url;

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
        post: function postLink(scope) {
          var $dragSrcEl,
              $placeholder = $('<li class="placeholder"></li>');

          /*
           *
           * Utilities
           *
           */

          jQuery.event.props.push('dataTransfer');

          var stopProp = function stopProp(e) {
            if (e.stopPropagation) {
              e.stopPropagation();
            }
          };

          var getPushEls = function getPushEls() {
            var pushEls = '<i class="glyphicon glyphicon-chevron-up"' +
                             'ng-click="pushPriority(\'up\', $event)"></i>' +
                          '<i class="glyphicon glyphicon-chevron-down"' +
                             'ng-click="pushPriority(\'down\', $event)"></i>';

            return $compile(pushEls)(scope);
          };

          var getRemoveEl = function getRemoveEl() {
            var removeEl = '<i class="remove glyphicon glyphicon-remove"' +
                              'ng-click="removePriority($event)"></i>';
            return $compile(removeEl)(scope);
          };

          var updatePriority = function updatePriority(apply) {
            scope.priorityList = [];
            $('.dropbox li').each(function () {
              scope.priorityList.push(this.id);
            });
            scope.priorityList.join(',');
            if (apply) {
              scope.$apply();
            }
          };


          /*
           *
           * Element Functions
           *
           */

          scope.removePriority = function removePriority($event) {
            var $el = $($event.target).parent(),
                id = +$el[0].id,
                obj = _.find(scope.data, {'id': id});

            $el.remove();
            obj.moved = false;
            updatePriority();
          };

          scope.pushPriority = function pushPriority (direction, e) {
            var $target = $(e.target).parent();
            if (direction === 'up') {
              $target.parent().prepend($target);
            } else if (direction === 'down') {
              $target.parent().append($target);
            }
            updatePriority();
          };


          /*
           *
           * Handlers
           *
           */

          var start = function start(e) {
            $dragSrcEl = $(this);

            $dragSrcEl.addClass('dragging');

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.outerHTML);
          };

          var end = function end() {
            $(this).removeClass('dragging');
            $dragSrcEl.show();
            $placeholder.detach();
            updatePriority(true);
          };

          var enter = function enter() {
            var $this = $(this);
            if ($this.is('.dropbox')) {
              $this.addClass('dragging-hover');
            } else {
              $dragSrcEl.hide();
              // super neat-oh trick borrowed from Farhadi's html5sortable plugin
              // https://github.com/farhadi/html5sortable
              $this[$placeholder.index() < $this.index() ? 'after' : 'before']($placeholder);
            }
          };

          var leave = function leave() {
            $(this).removeClass('dragging-hover');
          };

          // Drag hovering on element.
          var over = function over(e) {
            if (e.preventDefault) {
              e.preventDefault();
            }

            e.dataTransfer.dropEffect = 'move';

            return false;
          };

          // Element move
          var move = function move(e) {
            stopProp(e);

            var dragScopeObj = $dragSrcEl.scope() ? $dragSrcEl.scope().obj : null;

            var $this = $(this),
                $src = dragScopeObj ?
                       $(e.dataTransfer.getData('text/plain'))
                       : $dragSrcEl;

            $this.removeClass('dragging-hover');

            $src.removeClass('dragging');

            if (dragScopeObj) {
              $src.append(getRemoveEl).prepend(getPushEls)
                .on({
                  'dragstart': start,
                  'dragend': end,
                  'dragenter': enter,
                  'drop': move
                });
              dragScopeObj.moved = true;
              scope.$apply();
            }

            if ($this.is('.dropbox')) {
              $src.appendTo($this);
            } else {
              $src.insertBefore($placeholder);
            }

            return false;
          };


          /*
           *
           * Initial event attachment
           *
           */

          $('#prioritizer').on('dragload', function (e, el) {
            $(el).on({
              'dragstart': start,
              'dragend': end,
            });
          });

          $('.dropbox').on({
            'dragenter': enter,
            'dragleave': leave,
            'dragover': over,
            'drop': move
          });

          $placeholder.on({
            'drop': move
          });
        }
      }
    };
  });
