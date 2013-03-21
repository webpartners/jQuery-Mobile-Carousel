/*!
 * jQuery Mobile Carousel
 * Source: https://github.com/jherencia/jQuery-Mobile-Carousel
 * Demo: http://jsfiddle.net/blackdynamo/yxhzU/
 * Blog: http://developingwithstyle.blogspot.com
 *
 * Copyright 2010, Donnovan Lewis
 * Edits: Benjamin Gleitzman (gleitz@mit.edu)
 * Edits: Jaime Herencia Enjuto (jherencia@webpartners.es)
 * Licensed under the MIT
 */

(function($) {
  $.widget("ui.mobileCarousel", {
    version: '1.0',
    options: {
      duration: 300,
      direction: "horizontal",
      minimumDrag: 20,
      listSelector: '> ul',
      beforeStart: function() {},
      afterStart: function() {},
      beforeStop: function() {},
      afterStop: function() {}
    },
    _create: function() {
      var that = this;
      this.list = $(this.element).find(this.options.listSelector);

      // Check if selector has been initialized correctly
      if (this.list.size() != 1) {
        return;
      }

      // Initialize
      this.pages = this.list.children();
      this.width = $(this.element).width();
      this.height = $(this.element).height();
      this.currentPage = 0;
      this.start = null;
      this.end = null;
      this.touchStart = false;

      // CSS
      $(this.element).css({position: "relative", overflow: "hidden", width: this.width, height: this.height});
      this.list.css({
        position: "relative",
        padding: "0",
        margin: "0",
        listStyle: "none",
        width: this.pages.length * this.width
      });

      if (this.options.direction.toLowerCase() === "horizontal") {
        this.list.css({float: "left"});
        $.each(this.pages, function(i) {
          $(this).css({width: that.width, height: that.height, float: "left"});
        });
        this.list.draggable({
          axis: "x",
          start: function(event) {
            that.options.beforeStart.apply(that.list, arguments);

            that.touchStart = true;
            var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
            that.start = {
              coords: [ data.pageX, data.pageY ]
            };

            that.options.afterStart.apply(that.list, arguments);
          },
          stop: function(event) {
            that.options.beforeStop.apply(that.list, arguments);

            var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
            that.stop = {
              coords: [ data.pageX, data.pageY ]
            };

            that.start.coords[0] > that.stop.coords[0] ? that.moveLeft() : that.moveRight();
            that.touchStart = false;

            that.options.afterStop.apply(that.list, arguments);
          }
        });
      }
      else if (this.options.direction.toLowerCase() === "vertical") {
        $.each(this.pages, function(i) {
          $(this).css({width: that.width, height: that.height});
        });
        this.list.draggable({
          axis: "y",
          start: function(event) {
            that.options.beforeStart.apply(that.list, arguments);

            that.touchStart = true;
            var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
            that.start = {
              coords: [ data.pageX, data.pageY ]
            };

            that.options.afterStart.apply(that.list, arguments);
          },
          stop: function(event) {
            that.options.beforeStop.apply(that.list, arguments);

            var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
            that.stop = {
              coords: [ data.pageX, data.pageY ]
            };

            that.start.coords[1] > that.stop.coords[1] ? that.moveUp() : that.moveDown();
            that.touchStart = false;

            that.options.afterStop.apply(that.list, arguments);
          }
        });
      }
    },
    dragDelta: function() {
      if (!this.start || !this.stop) {
        return;
      }
      if (this.options.direction.toLowerCase() === "vertical") {
        return Math.abs(this.start.coords[1] - this.stop.coords[1]);
      }
      return Math.abs(this.start.coords[0] - this.stop.coords[0]);
    },
    moveLeft: function(options) {
      var lastPage = (this.currentPage === (this.pages.length - 1));
      if (lastPage && !this.touchStart) {
        return;
      }
      var dragDelta = this.dragDelta();
      if (lastPage || (dragDelta < this.options.minimumDrag)) {
        this.list.animate({ left: "+=" + dragDelta}, this.options.duration);
        return;
      }
      var newWidth = -1 * this.width * (this.currentPage + 1);
      this.list.animate({ left: newWidth}, this.options.duration);
      this.currentPage++;
    },
    moveRight: function() {
      var firstPage = (this.currentPage === 0);
      if (firstPage && !this.touchStart) {
        return;
      }
      var dragDelta = this.dragDelta();
      if (firstPage || (dragDelta < this.options.minimumDrag)) {
        this.list.animate({ left: "-=" + dragDelta}, this.options.duration);
        return;
      }
      var newWidth = -1 * this.width * (this.currentPage - 1);
      this.list.animate({ left: newWidth}, this.options.duration);
      this.currentPage--;
    },
    moveUp: function() {
      var lastPage = (this.currentPage === (this.pages.length - 1));
      if (lastPage && !this.touchStart) {
        return;
      }
      var dragDelta = this.dragDelta();
      if (lastPage || (dragDelta < this.options.minimumDrag)) {
        this.list.animate({ top: "+=" + dragDelta}, this.options.duration);
        return;
      }
      var newWidth = -1 * this.height * (this.currentPage + 1);
      this.list.animate({ top: newWidth}, this.options.duration);
      this.currentPage++;
    },
    moveDown: function() {
      var firstPage = (this.currentPage === 0);
      if (firstPage && !this.touchStart) {
        return;
      }
      var dragDelta = this.dragDelta();
      if (firstPage || (dragDelta < this.options.minimumDrag)) {
        this.list.animate({ top: "-=" + dragDelta}, this.options.duration);
        return;
      }
      var newWidth = -1 * this.height * (this.currentPage - 1);
      this.list.animate({ top: newWidth}, this.options.duration);
      this.currentPage--;
    }
  });
})(jQuery);