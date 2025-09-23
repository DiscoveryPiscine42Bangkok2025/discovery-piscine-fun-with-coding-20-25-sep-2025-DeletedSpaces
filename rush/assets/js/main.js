$(document).ready(function() {

    const hero = $('.hero-background');
    const floatingElements = $('.floating-element');

    // 1. Parallax effect for floating elements on mouse move
    hero.on('mousemove', function(e) {
        // Calculate mouse position relative to the center of the screen
        let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 25;

        // Apply a subtle transformation to each floating element
        // The movement amount is varied for a better depth effect
        $(floatingElements[0]).css('transform', `translate(${xAxis / 1.5}px, ${yAxis / 1.5}px)`);
        $(floatingElements[1]).css('transform', `translate(${xAxis * 0.8}px, ${yAxis * 0.8}px)`);
        $(floatingElements[2]).css('transform', `translate(${xAxis / 2}px, ${yAxis / 2}px)`);
    });

    // 2. Interactive tilt effect for portfolio cards
    $('.portfolio-card').on('mousemove', function(e) {
        let rect = this.getBoundingClientRect();
        let x = e.clientX - rect.left; // x position within the element.
        let y = e.clientY - rect.top;  // y position within the element.

        let centerX = rect.width / 2;
        let centerY = rect.height / 2;

        let rotateX = (y - centerY) / 10; // The '10' controls the tilt intensity
        let rotateY = (centerX - x) / 10;

        $(this).css({
            'transform': `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
            'transition': 'transform 0.1s linear'
        });
    });

    // Reset card tilt when mouse leaves
    $('.portfolio-card').on('mouseleave', function() {
        $(this).css({
            'transform': 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
            'transition': 'transform 0.4s ease-out'
        });
    });

    // 3. Smooth page transition on portfolio link click
    $('.portfolio-card a').on('click', function(e) {
        e.preventDefault(); // Prevent the default link behavior immediately
        const destination = $(this).attr('href'); // Get the destination URL

        // Add a fade-out effect to the body
        $('body').css('transition', 'opacity 0.5s ease-in-out');
        $('body').css('opacity', '0');

        // Wait for the animation to finish, then redirect
        setTimeout(function() {
            window.location.href = destination;
        }, 500); // 500ms matches the transition duration
    });

});