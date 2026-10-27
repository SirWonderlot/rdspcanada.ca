// Program quick check: "Not sure if you qualify?" on each program page.
// Markup: .qc (data-name, data-pass) > .qc-toggle + .qc-body > .qc-q (data-key,
// data-required, data-fail) with Yes/No buttons, and a .qc-result box.
// Nothing is saved or sent anywhere; answers stay on the page.
(function () {
  document.querySelectorAll('.qc').forEach(function (qc) {
    var toggle = qc.querySelector('.qc-toggle');
    var body = qc.querySelector('.qc-body');
    var result = qc.querySelector('.qc-result');
    var questions = qc.querySelectorAll('.qc-q');
    var answers = {};

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      body.hidden = !open;
    });

    questions.forEach(function (q) {
      q.querySelectorAll('.yn button').forEach(function (b) {
        b.addEventListener('click', function () {
          q.querySelectorAll('.yn button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          answers[q.dataset.key] = b.dataset.v;
          show();
        });
      });
    });

    function show() {
      // Wait until every question has an answer.
      for (var i = 0; i < questions.length; i++) {
        if (!answers[questions[i].dataset.key]) return;
      }
      var unmet = [];
      questions.forEach(function (q) {
        if (q.hasAttribute('data-required') && answers[q.dataset.key] === 'no') unmet.push(q.dataset.fail);
      });
      if (!unmet.length) {
        result.className = 'qc-result pass';
        result.innerHTML = '<h3>You may be eligible for the ' + qc.dataset.name + '</h3><p>' + qc.dataset.pass + '</p>';
      } else {
        result.className = 'qc-result fail';
        result.innerHTML = '<h3>You may not be eligible at this time</h3>' +
          '<p>Based on your answers, the following ' + (unmet.length === 1 ? 'requirement needs' : 'requirements need') + ' to be met:</p>' +
          '<ul>' + unmet.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>';
      }
      result.hidden = false;
    }
  });
})();
