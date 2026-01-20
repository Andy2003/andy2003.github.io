document.addEventListener('DOMContentLoaded', () => {
    // select elements containing reversed email parts
    const nodes = document.querySelectorAll('[data-mail-user-rev][data-mail-domain-rev]');

    const rev = s => (s || '').split('').reverse().join('');

    const buildHref = (userRev, domainRev, subject = '', body = '') => {
        const user = rev(userRev);
        const domain = rev(domainRev);
        if (!user || !domain) return null;
        const mail = `${user}@${domain}`;
        const params = new URLSearchParams();
        if (subject) params.set('subject', subject);
        if (body) params.set('body', body);
        const qs = params.toString();
        return qs ? `mailto:${mail}?${qs}` : `mailto:${mail}`;
    };

    const openMailto = (href) => {
        const win = window.open(href, '_blank');
        if (!win) window.location.href = href;
    };

    const attachHandlers = (el, href, visible) => {
        const clickHandler = e => {
            if (e && e.preventDefault) e.preventDefault();
            openMailto(href, !!(e && e.shiftKey));
        };

        if (el.tagName.toLowerCase() === 'a') {
            el.setAttribute('href', '#');
            el.setAttribute('role', 'button');
            if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
            el.innerHTML = visible;
            el.addEventListener('click', clickHandler);

            // middle-click should open in a new window/tab
            el.addEventListener('auxclick', ev => {
                if (ev.button === 1) {
                    ev.preventDefault();
                    openMailto(href, true);
                }
            });

            // keyboard activation: Enter or Space; Shift+Enter opens in new window/tab
            el.addEventListener('keydown', ev => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    openMailto(href, !!ev.shiftKey);
                }
            });
        } else {
            el.innerHTML = visible;
            el.appendChild(btn);
        }
    };

    nodes.forEach(el => {
        const userRev = el.getAttribute('data-mail-user-rev');
        const domainRev = el.getAttribute('data-mail-domain-rev');
        const subject = el.getAttribute('data-mail-subject') || '';
        const body = el.getAttribute('data-mail-body') || '';

        const href = buildHref(userRev, domainRev, subject, decodeURIComponent(body));
        if (!href) return; // skip invalid

        const visible = el.getAttribute('data-mail-visible') || `${rev(userRev)}<span class="displaynone">shutz</span>@<span class="displaynone">shutz</span>${rev(domainRev)}`;
        attachHandlers(el, href, visible);
    });

    // Active Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });

        // Back to top visibility
        const btt = document.getElementById('back-to-top');
        if (window.scrollY > 500) {
            btt.classList.add('visible');
        } else {
            btt.classList.remove('visible');
        }
    });

    document.getElementById('back-to-top').addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
});
