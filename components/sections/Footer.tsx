import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#top" className="nav__logo" aria-label="Elarion Labs home">
              <Logo />
              Elarion
            </a>
            <p>
              An AI-powered health & fitness system that coaches, cheers, and
              evolves with you.
            </p>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <h5>Product</h5>
              <a href="#vision">Vision</a>
              <a href="#capabilities">Capabilities</a>
              <a href="#how">How it works</a>
              <a href="#join">Early access</a>
            </div>
            <div className="footer__col">
              <h5>Company</h5>
              <a href="#top">About</a>
              <a href="#top">Careers</a>
              <a href="mailto:hello@elarionlabsinc.com">Contact</a>
            </div>
            <div className="footer__col">
              <h5>Legal</h5>
              <a href="#top">Privacy</a>
              <a href="#top">Terms</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Elarion Labs, Inc. All rights reserved.</span>
          <span>Made for people who want to evolve.</span>
        </div>
      </div>
    </footer>
  );
}
