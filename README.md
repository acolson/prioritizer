# Prioritizer

Directive to enable HTML5 Drag & Drop from one list to a second, and reordering within the second.

### Parameters

##### source *[var, string]*

Source is the data used to populate the lists.  It could be a scope variable or, if a string is supplied, a url.

##### sort *[var, string]*

String maps to property in source to sort by.

##### reverse *[var, bool]*

Boolean to reverse sort order.  Set true to reverse, omit otherwise.

##### template-url *[var, unquoted string]*

Url for the prioritizer template.

##### droplist-class *[var, string]*

Class to be applied to the drop list.

##### droplist-over-class *[var, string]*

Class to be applied when dragging over drop list.

##### dragging-class *[var, string]*

Class to be applied to element while being dragged.

### Events

##### dragLoad

Returns loaded list item as they populate the page.  Fires on root prioritizer element.

##### priorityUpdate

Returns scope of the moved element any time an item is added or reordered on the drop list.  Fires on root prioritizer element.

### Example HTML

```HTML
<div class="prioritizer"
     id="prioritizer"
     prioritizer
     source="list"
     sort="'id'"
     reverse="true"
     template-url="views/main.html"
     droplist-class="'dropbox'"
     droplist-over-class="'dragging-over'"
     dragging-class="'dragging'"
     >
</div>

```

### Example Template HTML

```HTML
<div class="list">
  <input type="search" ng-model="search">
  <ul>
    <li class="list-item"
        trigger-load
        ng-hide="item.priority !== null && item.priority >= 0"
        ng-repeat="item in data | filter:search | orderBy:sort:reverse track by item.id"
        >
        {{ item.id }} :: {{ item.name }} :: {{ item.sites }}
    </li>
  </ul>
</div>
<div>
  <h4>DROP it</h4>
  <ul ng-class="droplistClass">
    <li class="priority" trigger-load ng-repeat="item in priorities">
      <i class="push-priority glyphicon glyphicon-chevron-up"
         ng-hide="$first"
         ng-click="pushPriority('up', $event)"></i>
      <i class="push-priority glyphicon glyphicon-chevron-down"
         ng-hide="$last"
         ng-click="pushPriority('down', $event)"></i>
      {{ item.name }} :: {{ item.priority }}
      <i class="remove glyphicon glyphicon-remove"
         ng-click="removePriority()"></i>
    </li>
  </ul>
  <input type="text" id="priorityList" ng-model="exportList">
</div>
```
