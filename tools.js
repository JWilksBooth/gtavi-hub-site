/* Client-side page tools — no backend, no tracking, no external requests.
   Each block is inert unless its container exists on the page. */
(function () {
  "use strict";

  // ---------- countdown ----------
  var cd = document.getElementById("cd-days");
  if (cd) {
    var TARGET = new Date("2026-11-19T00:00:00-05:00"); // midnight ET, launch day
    var detail = document.getElementById("cd-detail");
    var tick = function () {
      var now = new Date();
      var ms = TARGET - now;
      if (ms <= 0) {
        cd.textContent = "IT'S OUT";
        if (detail) detail.textContent = "GTA 6 is available now. Go find your crew.";
        return;
      }
      var s = Math.floor(ms / 1000);
      var d = Math.floor(s / 86400);
      var h = Math.floor((s % 86400) / 3600);
      var m = Math.floor((s % 3600) / 60);
      var sec = s % 60;
      cd.textContent = d;
      if (detail) {
        detail.textContent = h + " hours, " + m + " minutes, " + sec +
          " seconds — until Thursday, November 19, 2026 (midnight ET).";
      }
    };
    tick();
    setInterval(tick, 1000);
  }

  // ---------- storage calculator ----------
  var out = document.getElementById("storageout");
  if (out) {
    var sel = document.getElementById("console");
    var used = document.getElementById("used");
    var assume = document.getElementById("assume");
    var calc = function () {
      var usable = parseFloat(sel.value) || 0;
      var u = Math.max(0, parseFloat(used.value) || 0);
      var need = Math.max(0, parseFloat(assume.value) || 0);
      var free = usable - u;
      var gap = need - free;
      var msg, cls;
      if (free >= need + 25) {
        cls = "ok";
        msg = "You're fine. " + Math.round(free) + " GB free — that's GTA 6 (" +
              need + " GB) plus room for the day-one patch.";
      } else if (free >= need) {
        cls = "warn";
        msg = "It fits, barely. " + Math.round(free) + " GB free vs " + need +
              " GB needed. Clear another 20-30 GB so the day-one patch doesn't stall.";
      } else {
        cls = "bad";
        msg = "Not enough room. You need about " + Math.ceil(gap) +
              " GB more — delete or archive a couple of big games, or add storage.";
      }
      out.className = "calcout " + cls;
      out.textContent = msg;
    };
    [sel, used, assume].forEach(function (el) {
      el.addEventListener("input", calc);
      el.addEventListener("change", calc);
    });
    calc();
  }

  // ---------- crew name generator ----------
  var roll = document.getElementById("crewroll");
  if (roll) {
    var NAMES = {
      vice: ["Neon Tide","Vice Nights","Sunset Syndicate","Palm & Powder","Flamingo Heights",
        "Midnight Leonida","Chrome Coast","Alligator Alley","Vice Vultures","Neon Cartel",
        "Saltwater Kings","Boulevard Boys","Pastel Pirates","Humid Money","Everglade Empire",
        "Deco Dealers","Gulf Static","Tropic Static","The Vice Grip","Sunburn Society",
        "Ocean Drive Outfit","Coconut Cartel","Neon Undertow","Bayfront Bandits"],
      hard: ["Iron Verdict","Black Tide","Nine Lives","Concrete Wolves","Ghost Payroll",
        "Dead Signal","Red Meridian","The Quiet Part","Terminal Velocity","Cold Open",
        "Hollow Point","Last Call Syndicate","Grave Shift","No Witnesses","Static Kings",
        "Blunt Force","Zero Sum","The Long Con","Broken Compass","Night Freight",
        "Steel Alibi","Bad Weather","Final Notice","Dial Tone","Hard Reset"],
      funny: ["Tax Evaders","Definitely Not Cops","Insurance Fraud LLC","Reckless & Sons",
        "Wheelman Wanted","Two Stars Max","Lost The Getaway Car","Mission Failed Crew",
        "Sorry Wrong Bank","Local Business Owners","Emotional Damage","Sunday Drivers",
        "Property Damage Inc","Refunded","Ramp Enthusiasts","Loading Screen Legends",
        "Fast Travel Purists","Passive Mode Cowards","Honk If Armed","Parking Violation",
        "Uninsured Motorists","The Wrong Yacht","Airbags Deployed","Return To Sender"],
      street: ["Fifth Street Firm","The Payroll","Nightshift Union","Getaway Co","Loose Ends",
        "Silent Partners","The Split","Clean Hands","Cash Only","The Vault Boys",
        "Backdoor Crew","Skeleton Key","Wire Transfer","Heist Nights","No Alarms",
        "Take The Van","Second Story","Crowbar Club","Duffel Bag Society","Blueprints",
        "The Inside Job","Soft Target","Alarm Off","Split Six Ways"],
      clean: ["Verve","Tidal","Ember","Onyx","Vice","Drift","Halo","Sable","Cinder","Vector",
        "Rogue","Nova","Kilo","Delta","Apex","Prowl","Vault","Tempo","Torch","Rift",
        "Havoc","Crest","Wraith","Ashfall"]
    };
    var vibe = document.getElementById("crewvibe");
    var outEl = document.getElementById("crewout");
    var copied = document.getElementById("crewcopied");

    var pool = function () {
      var v = vibe.value;
      if (v !== "all" && NAMES[v]) return NAMES[v].slice();
      return Object.keys(NAMES).reduce(function (a, k) { return a.concat(NAMES[k]); }, []);
    };
    var tag = function (name) {
      var words = name.replace(/[^A-Za-z ]/g, "").split(/\s+/).filter(Boolean);
      if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
      return words.map(function (w) { return w[0]; }).join("").slice(0, 4).toUpperCase();
    };
    var render = function () {
      var p = pool();
      var picks = [];
      while (picks.length < 5 && p.length) {
        picks.push(p.splice(Math.floor(Math.random() * p.length), 1)[0]);
      }
      outEl.innerHTML = "";
      picks.forEach(function (n) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "crewpick";
        b.innerHTML = '<span class="cn">' + n + '</span> <span class="ct">' + tag(n) + "</span>";
        b.addEventListener("click", function () {
          var t = n;
          if (navigator.clipboard) { navigator.clipboard.writeText(t); }
          if (copied) { copied.hidden = false; setTimeout(function () { copied.hidden = true; }, 1500); }
        });
        outEl.appendChild(b);
      });
    };
    roll.addEventListener("click", render);
    vibe.addEventListener("change", render);
    render();
  }
})();
