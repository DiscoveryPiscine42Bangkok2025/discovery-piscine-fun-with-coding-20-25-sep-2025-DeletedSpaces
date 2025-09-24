$(document).ready(function() {

    // --- Custom Cursor Logic ---
    const cursorDot = $('.cursor-dot');
    const cursorOutline = $('.cursor-outline');

    $(window).on('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Make cursor visible when mouse enters viewport
        cursorDot.css('opacity', '1');
        cursorOutline.css('opacity', '1');
        
        cursorDot.css({
            left: `${posX}px`,
            top: `${posY}px`
        });
        
        cursorOutline.css({
            left: `${posX}px`,
            top: `${posY}px`
        });
    });

    // Add grow effect on hover
    $('.interactive-link').on('mouseenter', function() {
        cursorOutline.addClass('grow');
    }).on('mouseleave', function() {
        cursorOutline.removeClass('grow');
    });

    // Hide cursor when it leaves the window
    $('body').on('mouseleave', function() {
        cursorDot.css('opacity', '0');
        cursorOutline.css('opacity', '0');
    });

    // --- Active Link Highlighting on Scroll ---
    const sections = $('section');
    const navLinks = $('.nav-link');

    $(window).on('scroll', function() {
        let currentSectionId = '';
        sections.each(function() {
            const sectionTop = $(this).offset().top;
            if ($(window).scrollTop() >= sectionTop - ($(window).height() / 2)) {
                currentSectionId = $(this).attr('id');
            }
        });

        navLinks.each(function() {
            $(this).removeClass('active');
            if ($(this).attr('href') === '#' + currentSectionId) {
                $(this).addClass('active');
            }
        });
    });

    // --- Project Card Glow Effect ---
    $('.project-card').on('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        $(this).find('.card-glow').css({
            '--x': `${x}px`,
            '--y': `${y}px`
        });
    });

    $('.tab-button').on('click', function() {
        const targetTab = $(this).data('tab');

        // Update button active state
        $('.tab-button').removeClass('active');
        $(this).addClass('active');

        // Show/hide content panels
        $('.tab-panel').addClass('hidden');
        $('#' + targetTab).removeClass('hidden');
    });

    // --- Smooth Page Transition for Back Button ---
    $('.nav-back').on('click', function(e) {
        e.preventDefault();
        const destination = $(this).attr('href');
        $('body').css('transition', 'opacity 0.5s ease-in-out').css('opacity', '0');
        setTimeout(() => { window.location.href = destination; }, 500);
    });

    $('#contact-form').on('submit', function(e) {
        e.preventDefault();

        alert("Thank you for your message! Please note: this is a demo and the form is not functional.");

        $(this).trigger('reset');
    });

});