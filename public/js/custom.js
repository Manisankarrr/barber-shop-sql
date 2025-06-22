(function ($) {
  "use strict";

  // MENU
  $('#sidebarMenu .nav-link').on('click', function () {
    $("#sidebarMenu").collapse('hide');
  });

  // CUSTOM LINK
  $('.smoothscroll').click(function () {
    var el = $(this).attr('href');
    var elWrapped = $(el);
    var header_height = $('.navbar').height();

    scrollToDiv(elWrapped, header_height);
    return false;

    function scrollToDiv(element, navheight) {
      var offset = element.offset();
      var offsetTop = offset.top;
      var totalScroll = offsetTop - navheight;

      $('body,html').animate({
        scrollTop: totalScroll
      }, 300);
    }
  });

  // ✅ FORM SUBMIT HANDLER (wait until HTML is ready)
  $(document).ready(function () {
    const form = document.getElementById("bookingForm");

    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = {
          name: document.getElementById("name").value,
          phone: document.getElementById("phone").value,
          email: document.getElementById("email").value,
          date: document.getElementById("date").value,
          time: document.getElementById("time").value,
          branch: document.getElementById("branch").value,
          people: document.getElementById("people").value,
          message: document.getElementById("message").value
        };

        try {
          const res = await fetch("http://barbershop-alb-29040749.ap-south-1.elb.amazonaws.com/api/book", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          });

          const data = await res.json();

          if (res.ok) {
            alert("✅ Booking successful!");
            form.reset();
          } else {
            alert("❌ Booking failed: " + data.error);
          }
        } catch (err) {
          console.error("❌ Network error:", err);
          alert("❌ Could not connect to server");
        }
      });
    }
  });

})(window.jQuery);
