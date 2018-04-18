new Vue({
  el: '#app',
  data: function() {
    return {
      isActive: false, // for dropdown menu
      isVisible: false,
      windowWidth: 0,
      isMobile: false
    }
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('resize', this.getWindowWidth);
      window.addEventListener('resize', this.toggleMobileMenuOnResize);

      //Init
      this.getWindowWidth()
      this.toggleMobileMenuOnResize()
    })
  },
  methods: {
    toggleDropdown: function() { // for dropdown menu
      this.isActive = !this.isActive
    },
    toggleMobileMenu: function() {
      this.isVisible = !this.isVisible
    },
    toggleMobileMenuOnResize: function() {
      if (this.windowWidth <= 1024) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    },
    getWindowWidth(event) {
      this.windowWidth = document.documentElement.clientWidth;
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowWidth);
  }
});

// BURGER BAR MENU TOGGLE
document.addEventListener('DOMContentLoaded', function() {

  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(function($el) {
      $el.addEventListener('click', function() {

        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

});
