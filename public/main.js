htmx.onLoad(function (content) {
  var sortables = content.querySelectorAll(".sortable");
  for (let i = 0; i < sortables.length; i++) {
    var sortable = sortables[i];
    var sortableInstance = new Sortable(sortable, {
      animation: 150,
      ghostClass: "blue-background-class",

      filter: ".htmx-indicator",
      onMove: function (evt) {
        return evt.related.className.indexOf("htmx-indicator") === -1;
      },

      onEnd: function (evt) {
        this.option("disabled", true);
      },
    });

    sortable.addEventListener("htmx:afterSwap", function () {
      sortableInstance.option("disabled", false);
    });
  }
});
