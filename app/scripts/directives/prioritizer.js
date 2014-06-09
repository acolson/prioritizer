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

  .directive('prioritizer', function ($compile, _) {
    return {
      templateUrl: function (el, attrs) {
        return attrs.templateUrl;
      },
      scope: {
        data: '=source',
      },
      restrict: 'E',
      replace: true,
      link: function postLink(scope) {
        var $dragSrcEl;


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
        };

        var enter = function enter() {
          $(this).addClass('dragging-hover');
        };

        var leave = function leave() {
          $(this).removeClass('dragging-hover');
        };

        var over = function over(e) {
          if (e.preventDefault) {
            e.preventDefault();
          }

          e.dataTransfer.dropEffect = 'move';

          return false;
        };

        var order = function order(e) {
          stopProp(e);

          var $this = $(this);

          $dragSrcEl.insertBefore($this)
            .removeClass('dragging');
            // .on({
            //   'dragstart': start,
            //   'dragend': end,
            //   'drop': order
            // });
        };

        var move = function move(e) {
          stopProp(e);

          var dragScopeObj = $dragSrcEl.scope().obj;

          var $this = $(this),
              removeEl = $compile('<i class="glyphicon glyphicon-remove"' +
                            'ng-click="removePriority($event)"></i>')(scope),
              $src = dragScopeObj ?
                     $(e.dataTransfer.getData('text/plain'))
                     : $dragSrcEl;

          $this.removeClass('dragging-hover');

          $src.appendTo($this)
            .removeClass('dragging')
            .on({
              'dragstart': start,
              'dragend': end,
              'drop': order
            });

          if (dragScopeObj) {
            dragScopeObj.moved = true;
            scope.$apply();
            $src.append(removeEl);
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
            'dragend': end
          });
        });

        $('.dropbox').on({
          'dragenter': enter,
          'dragleave': leave,
          'dragover': over,
          'drop': move
        });


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
        };
      }
    };
  });
