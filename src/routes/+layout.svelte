  <nav class="navbar is-fixed-top has-shadow" aria-label="main navigation">
    <div class="navbar-brand">
          <a class="navbar-item" href="/">
          <img src="/favicon.png" alt="Delete Recording App" />
        </a>

      <button
        id="main-burger"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </div>
  </nav>

  <main id="app">
  <slot/>
  </main>

  <footer class="footer has-background-grey-lighter">
    <div class="content has-text-centered">
      <p>
        <strong>Delete Recording</strong> by
        <a href="https://github.com/wxsd-sales" target="_blank" referrerpolicy="no-referrer">WXSD-Sales</a>.<br />
        &copy; {new Date().getUTCFullYear()} Webex by Cisco
      </p>
    </div>
  </footer>

  <style>
    #app {
        min-height: 100vh;
        }
  </style>