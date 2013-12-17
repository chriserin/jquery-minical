(function() {
  var $, tester;

  $ = jQuery;

  $.fx.off = true;

  tester = {
    keydown: function(k, msg, $el) {
      var $e;
      if ($el == null) {
        $el = this.$el;
      }
      if (msg) {
        ok(true, "I press " + msg);
      }
      $e = $.Event('keydown');
      $e.keyCode = $e.which = k;
      return $el.trigger($e);
    },
    initDropdowns: function(options) {
      var $d, $div, $m, $y, d, defaults, dropdown_opts, i, m, opts, y, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      defaults = {
        opts: {},
        month: 12,
        day: 21,
        year: 2012,
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days: (function() {
          _results = [];
          for (_i = 1; _i <= 31; _i++){ _results.push(_i); }
          return _results;
        }).apply(this),
        years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020].reverse(),
        blank: true
      };
      opts = $.extend(true, defaults, options);
      $div = $(".calendar");
      $div.find(":text").remove();
      $m = $("<select />", {
        "class": "months"
      }).appendTo($div);
      $d = $("<select />", {
        "class": "days"
      }).appendTo($div);
      $y = $("<select />", {
        "class": "years"
      }).appendTo($div);
      _ref = opts.months;
      for (i = _j = 0, _len = _ref.length; _j < _len; i = ++_j) {
        m = _ref[i];
        $m.append($("<option />", {
          text: m,
          value: i + 1
        }));
      }
      _ref1 = opts.days;
      for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
        d = _ref1[_k];
        $d.append($("<option />", {
          text: d,
          value: d
        }));
      }
      _ref2 = opts.years;
      for (_l = 0, _len2 = _ref2.length; _l < _len2; _l++) {
        y = _ref2[_l];
        $y.append($("<option />", {
          text: y,
          value: y
        }));
      }
      if (opts.blank) {
        $m.prepend($("<option />", {
          value: ""
        }));
        $d.prepend($("<option />", {
          value: ""
        }));
        $y.prepend($("<option />", {
          value: ""
        }));
      }
      $m.val(opts.month);
      $d.val(opts.day);
      $y.val(opts.year);
      dropdown_opts = {
        trigger: ".trigger",
        dropdowns: {
          month: ".months",
          day: ".days",
          year: ".years"
        }
      };
      return this.$el = $(".calendar").minical($.extend(opts.opts, dropdown_opts));
    },
    cal: function(selector) {
      var $cal;
      $cal = this.$el.data("minical").$cal;
      if (selector) {
        return $cal.find(selector);
      } else {
        return $cal;
      }
    },
    init: function(opts, date) {
      $(document).off("keydown");
      if (date == null) {
        date = "12/1/2012";
      }
      return this.$el = $(".calendar :text").val(date).minical(opts);
    }
  };

  $.fn.getTextArray = function() {
    return ($(this).map(function() {
      return $(this).text();
    })).get();
  };

  $.fn.shouldHaveValue = function(val) {
    equal(this.val(), val, "" + this.selector + " should have a value of " + val);
    return this;
  };

  $.fn.shouldBe = function(attr) {
    ok(this.is(attr), "" + this.selector + " should be " + attr);
    return this;
  };

  $.fn.shouldNotBe = function(attr) {
    ok(!this.is(attr), "" + this.selector + " should not be " + attr);
    return this;
  };

  $.fn.shouldSay = function(text) {
    equal(this.text(), text, "" + text + " is displayed within " + this.selector);
    return this;
  };

  test("it is chainable", function() {
    return ok(tester.init().hide().show().is(":visible"), "minical is invoked and visibility is toggled");
  });

  test("minical triggers on focus", function() {
    var $input;
    $input = tester.init().focus();
    return tester.cal().shouldBe(":visible");
  });

  test("minical hides on blur", function() {
    var $input;
    $input = tester.init().blur();
    return tester.cal().shouldNotBe(":visible");
  });

  test("minical hides on outside click", function() {
    var $input;
    $input = tester.init().focus();
    tester.cal("h1").click();
    tester.cal().shouldBe(":visible");
    $("#qunit").click();
    return tester.cal().shouldNotBe(":visible");
  });

  module("Rendering a month");

  test("minical displays the correct month heading", function() {
    var $input;
    $input = tester.init().focus();
    return tester.cal("h1").shouldSay("Dec 2012");
  });

  test("minical displays the correct day table", function() {
    var $input, day, days;
    $input = tester.init().focus();
    deepEqual(tester.cal("th").getTextArray(), ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "Days of week are displayed properly");
    days = (function() {
      var _i, _j, _len, _ref, _results, _results1;
      _ref = [].concat([25, 26, 27, 28, 29, 30], (function() {
        _results1 = [];
        for (_j = 1; _j <= 31; _j++){ _results1.push(_j); }
        return _results1;
      }).apply(this), [1, 2, 3, 4, 5]);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        day = _ref[_i];
        _results.push(day + "");
      }
      return _results;
    })();
    return deepEqual(tester.cal("td").getTextArray(), days, "days of month are displayed properly");
  });

  test("clicking a day sets input to that value", function() {
    var $input;
    $input = tester.init().focus();
    tester.cal("td.minical_day_12_21_2012 a").click();
    tester.cal().shouldNotBe(":visible");
    return $input.shouldHaveValue("12/21/2012");
  });

  test("minical fades out displayed days not of current month", function() {
    var $input;
    $input = tester.init().focus();
    tester.cal("td:lt(7)").shouldBe(".minical_past_month");
    return tester.cal("td:last").shouldBe(".minical_future_month");
  });

  test("minical highlights the current day", function() {
    var $input, today, today_array;
    today = new Date();
    today_array = [today.getMonth() + 1, today.getDate(), today.getFullYear()];
    $input = tester.init({}, today_array.join("/")).focus();
    return tester.cal("td.minical_day_" + (today_array.join('_'))).shouldBe(".minical_today");
  });

  test("minical triggers from a separate trigger element", function() {
    var $el, opts;
    opts = {
      trigger: ".trigger"
    };
    $el = tester.init(opts);
    $el.data("minical").$trigger.click();
    return tester.cal().shouldBe(":visible");
  });

  test("minical triggers from a trigger element defined through a function", function() {
    var $el, opts;
    $('.calendar').after($("<a />", {
      "class": "other_trigger"
    }));
    opts = {
      trigger: function() {
        return $(this).closest('.calendar').siblings().filter(".other_trigger");
      }
    };
    $el = tester.init(opts);
    equal($el.data("minical").$trigger.length, 1, "trigger exists");
    $el.data("minical").$trigger.click();
    return tester.cal().shouldBe(":visible");
  });

  test("minical does not show from trigger if input is disabled", function() {
    var $el, opts;
    opts = {
      trigger: ".trigger"
    };
    $el = tester.init(opts);
    $el.prop("disabled", true);
    $el.data("minical").$trigger.click();
    return tester.cal().shouldNotBe(":visible");
  });

  module("Navigating between months");

  test("click to view next month", function() {
    tester.init().focus();
    tester.cal(".minical_next").click();
    tester.cal("h1").shouldSay("Jan 2013");
    return tester.cal().shouldBe(":visible");
  });

  test("click to view previous month", function() {
    tester.init().focus();
    tester.cal(".minical_prev").click();
    tester.cal("h1").shouldSay("Nov 2012");
    return tester.cal().shouldBe(":visible");
  });

  test("Minimum date specified", function() {
    var $input, opts;
    opts = {
      from: new Date("October 4, 2012")
    };
    $input = tester.init(opts).focus();
    tester.cal(".minical_prev").click();
    tester.cal(".minical_prev").click();
    tester.cal(".minical_prev").shouldNotBe(":visible");
    tester.cal("h1").shouldSay("Oct 2012");
    tester.cal("td.minical_day_10_4_2012").shouldNotBe(".minical_disabled");
    tester.cal("td.minical_day_10_3_2012").shouldBe(".minical_disabled").find("a").click();
    tester.cal().shouldBe(":visible");
    return $input.shouldHaveValue("12/1/2012");
  });

  test("Maximum date specified", function() {
    var $input, opts;
    opts = {
      to: new Date("February 26, 2013")
    };
    $input = tester.init(opts).focus();
    tester.cal(".minical_next").click();
    tester.cal(".minical_next").click();
    tester.cal(".minical_next").shouldNotBe(":visible");
    tester.cal("h1").shouldSay("Feb 2013");
    tester.cal("td.minical_day_2_26_2013").shouldNotBe(".minical_disabled");
    tester.cal("td.minical_day_2_27_2013").shouldBe(".minical_disabled").find("a").click();
    tester.cal().shouldBe(":visible");
    return $input.shouldHaveValue("12/1/2012");
  });

  test("Min and max can be specified via data attributes", function() {
    var $input, from, to;
    $input = $(".calendar :text");
    from = new Date("November 15, 2012");
    to = new Date("January 15, 2013");
    $input.attr('data-minical-from', +from);
    $input.attr('data-minical-to', +to);
    $input = tester.init();
    deepEqual(from, $input.data('minical').from, "`from` value should assign from data attribute");
    return deepEqual(to, $input.data('minical').to, "`to` value should assign from data attribute");
  });

  module("Firing using dropdowns");

  test("displays when trigger clicked and dropdowns specified", function() {
    tester.initDropdowns().find(".trigger").click();
    return tester.cal("h1").shouldSay("Dec 2012");
  });

  test("defaults to today if dropdowns are blank", function() {
    var $el, options, today, today_array;
    options = {
      month: '',
      day: '',
      year: '',
      blank: true
    };
    today = new Date();
    today_array = [today.getMonth() + 1, today.getDate(), today.getFullYear()];
    $el = tester.initDropdowns(options);
    $el.data("minical").$trigger.click();
    return tester.cal("td.minical_day_" + (today_array.join('_'))).shouldBe(":visible");
  });

  test("clicking a day sets dropdowns to that value", function() {
    var $el;
    $el = tester.initDropdowns();
    $el.data("minical").$trigger.click();
    tester.cal("td.minical_12_21_2012").click();
    $el.find(".months").shouldHaveValue(12);
    $el.find(".days").shouldHaveValue(21);
    return $el.find(".years").shouldHaveValue(2012);
  });

  test("changing dropdowns updates visible calendar", function() {
    var $el;
    $el = tester.initDropdowns();
    $el.find(".trigger").click();
    $el.find(".years option:contains('2011')").prop("selected", true).parent().change();
    tester.cal("h1").shouldSay("Dec 2011");
    return tester.cal("td.minical_day_12_21_2011").shouldBe(".minical_selected");
  });

  test("Minimum date is autodetected from dropdown content", function() {
    var $el, opts;
    opts = {
      month: 1,
      day: 1,
      year: 2000
    };
    $el = tester.initDropdowns(opts).data("minical").$trigger.click();
    tester.cal("td.minical_day_12_31_1999").shouldBe(".minical_disabled");
    tester.cal("td.minical_day_1_1_2000").shouldNotBe(".minical_disabled");
    return tester.cal(".minical_prev").shouldNotBe(":visible");
  });

  test("Maximum date is autodetected from dropdown content", function() {
    var $el, opts;
    opts = {
      month: 12,
      day: 25,
      year: 2020
    };
    $el = tester.initDropdowns(opts).data("minical").$trigger.click();
    return tester.cal(".minical_next").shouldNotBe(":visible");
  });

  test("Dropdown date detection works with ascending or descending year values", function() {
    var $el, opts, _i, _results;
    opts = {
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      days: (function() {
        _results = [];
        for (_i = 1; _i <= 31; _i++){ _results.push(_i); }
        return _results;
      }).apply(this),
      years: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      month: 12,
      day: 15,
      year: 2000
    };
    $el = tester.initDropdowns(opts);
    $el.data("minical").$trigger.click();
    tester.cal(".minical_next").click();
    tester.cal("td.minical_day_1_8_2001 a").click();
    $el.find(".months").shouldHaveValue(1);
    $el.find(".days").shouldHaveValue(8);
    $el.find(".years").shouldHaveValue(2001);
    return tester.cal().shouldNotBe(":visible");
  });

  module("Testing alignment");

  test("Calendar aligns to trigger if one is specified", function() {
    var $el, $trigger, opts;
    opts = {
      trigger: ".trigger"
    };
    $el = tester.init(opts);
    $trigger = $el.data("minical").$trigger.click();
    equal($trigger.offset().left, tester.cal().show().offset().left, "Calendar and trigger left offsets are identical");
    return equal($trigger.offset().top + $trigger.outerHeight() + 5, tester.cal().show().offset().top, "Calendar is 5px below trigger by default");
  });

  test("Calendar offset can be specified", function() {
    var $el, $trigger, opts;
    opts = {
      trigger: ".trigger",
      offset: {
        x: 20,
        y: 20
      }
    };
    $el = tester.init(opts);
    $trigger = $el.data("minical").$trigger.click();
    equal($trigger.offset().left + 20, tester.cal().offset().left, "Calendar is 20px to the right of trigger");
    return equal($trigger.offset().top + $trigger.outerHeight() + 20, tester.cal().offset().top, "Calendar is 20px below trigger");
  });

  test("Calendar aligns to trigger if dropdowns are used", function() {
    var $el, $trigger;
    $el = tester.initDropdowns();
    $trigger = $el.data("minical").$trigger.click();
    equal($trigger.offset().left, tester.cal().offset().left, "Calendar and trigger left offsets are identical");
    return equal($trigger.offset().top + $trigger.outerHeight() + 5, tester.cal().offset().top, "Calendar is 5px below trigger by default");
  });

  test("Calendar aligns to text input if no trigger is specified", function() {
    var $el;
    $el = tester.init().focus();
    equal($el.offset().left, tester.cal().offset().left, "Calendar and input left offsets are identical");
    return equal($el.offset().top + $el.outerHeight() + 5, tester.cal().offset().top, "Calendar is 5px below input by default");
  });

  test("Calendar can be overridden to align to text input", function() {
    var $el, opts;
    opts = {
      trigger: ".trigger",
      align_to_trigger: false
    };
    $el = tester.init(opts).focus();
    equal($el.offset().left, tester.cal().offset().left, "Calendar and input left offsets are identical");
    return equal($el.offset().top + $el.outerHeight() + 5, tester.cal().offset().top, "Calendar is 5px below input by default");
  });

  test("Calendar should be appended to the body by default", function() {
    tester.init();
    return ok(tester.cal().parent().is("body"), "Calendar is appended to the body.");
  });

  test("Calendar can be overridden to append to an arbitrary element", function() {
    tester.init({
      appendCalendarTo: function() {
        return this.parents(".calendar");
      }
    });
    return ok(tester.cal().parent().is(".calendar"), "Calendar is appended to the .calendar element");
  });

  module("Selection feedback and keyboard support");

  test("Select date in calendar on draw", function() {
    tester.init().focus();
    equal(tester.cal("td.minical_selected").length, 1, "Only one td with 'selected' class");
    return tester.cal("td.minical_day_12_1_2012").shouldBe(".minical_selected");
  });

  test("Select date in calendar on redraw", function() {
    var $input;
    $input = tester.init().focus();
    tester.cal("td.minical_day_12_1_2012").shouldBe(".minical_selected");
    tester.cal("td.minical_day_12_7_2012 a").click();
    $input.focus();
    equal(tester.cal("td.minical_selected").length, 1, "Only one td with 'selected' class");
    tester.cal("td.minical_day_12_7_2012").shouldBe(".minical_selected");
    tester.cal("a.minical_next").click();
    return equal(tester.cal(".minical_selected").length, 0, "selected day was for previous month");
  });

  test("Highlight existing choice if available", function() {
    tester.init({}, "12/5/2012").focus();
    return tester.cal("td.minical_day_12_5_2012").shouldBe(".minical_highlighted");
  });

  test("Highlight triggers on mouse hover", function() {
    tester.init().focus();
    tester.cal("td:eq(3) a").trigger("mouseover").parent().shouldBe(".minical_highlighted");
    return equal(tester.cal("td.minical_selected").length, 1, "Only one td with 'selected' class");
  });

  test("Enter on trigger or input toggles calendar and selects highlighted day", function() {
    var $input, opts;
    opts = {
      trigger: ".trigger"
    };
    $input = tester.init(opts).focus();
    tester.cal("td.minical_day_11_25_2012 a").trigger("mouseover");
    tester.keydown(13, "enter");
    tester.cal().shouldNotBe(":visible");
    $input.shouldHaveValue("11/25/2012");
    $input.data('minical').$trigger.focus();
    tester.cal("td.minical_day_11_27_2012 a").trigger("mouseover");
    tester.keydown(13, "enter");
    tester.cal().shouldNotBe(":visible");
    return $input.shouldHaveValue("11/27/2012");
  });

  test("Arrow keys move around current month", function() {
    tester.init().focus();
    tester.keydown(37, "left arrow");
    tester.cal("td.minical_day_11_30_2012").shouldBe(".minical_highlighted");
    tester.keydown(40, "down arrow");
    tester.cal("td.minical_day_12_7_2012").shouldBe(".minical_highlighted");
    tester.keydown(39, "right arrow");
    tester.cal("td.minical_day_12_8_2012").shouldBe(".minical_highlighted");
    tester.keydown(38, "up arrow");
    return tester.cal("td.minical_day_12_1_2012").shouldBe(".minical_highlighted");
  });

  test("Arrow keys move around ends of week", function() {
    tester.init().focus();
    tester.keydown(39, "right arrow");
    tester.cal("td.minical_day_12_2_2012").shouldBe(".minical_highlighted");
    tester.keydown(37, "left arrow");
    return tester.cal("td.minical_day_12_1_2012").shouldBe(".minical_highlighted");
  });

  test("Arrow keys move around ends of month", function() {
    tester.init().focus();
    tester.cal("td.minical_day_11_25_2012 a").trigger("mouseover");
    tester.keydown(37, "left arrow");
    tester.cal("h1").shouldSay("Nov 2012");
    tester.cal("td.minical_day_11_24_2012").shouldBe(".minical_highlighted");
    tester.keydown(40, "down arrow");
    tester.keydown(40, "down arrow");
    tester.cal("h1").shouldSay("Dec 2012");
    return tester.cal("td.minical_day_12_8_2012").shouldBe(".minical_highlighted");
  });

  test("Arrow keys should not go to inaccessible months", function() {
    var options;
    options = {
      opts: {
        trigger: ".trigger",
        to: new Date("January 5, 2013")
      }
    };
    tester.initDropdowns(options).find(".trigger").click();
    tester.cal(".minical_next").shouldNotBe(":visible");
    tester.keydown(40, "down arrow");
    tester.keydown(40, "down arrow");
    tester.cal("td.minical_day_1_4_2013").shouldBe(".minical_highlighted");
    tester.keydown(40, "down arrow");
    return tester.cal("td.minical_day_1_4_2013").shouldBe(".minical_highlighted");
  });

  test("Arrow keys should not go to inaccessible days", function() {
    var opts;
    opts = {
      to: new Date("December 17, 2012")
    };
    tester.init(opts).focus();
    tester.keydown(40, "down arrow");
    tester.keydown(40, "down arrow");
    tester.cal("td.minical_day_12_15_2012").shouldBe(".minical_highlighted");
    tester.keydown(40, "down arrow");
    tester.cal("td.minical_day_12_15_2012").shouldBe(".minical_highlighted");
    tester.keydown(39, "right arrow");
    tester.keydown(39, "right arrow");
    tester.keydown(39, "right arrow");
    return tester.cal("td.minical_day_12_17_2012").shouldBe(".minical_highlighted");
  });

  test("Arrow keys fire anywhere on page as long as calendar is visible", function() {
    tester.initDropdowns().find(".trigger").click();
    tester.keydown(37, "left arrow", $("body"));
    return tester.cal("td.minical_day_12_20_2012").shouldBe(".minical_highlighted");
  });

  module("Other options");

  test("Initialize with data-minical-initial attribute if provided", function() {
    $(".calendar :text").attr("data-minical-initial", "Tue Aug 07 2012 00:00:00 GMT-0400 (EDT)").val("August seventh two thousand and twelvey!");
    tester.init({
      write_initial_value: false
    }).focus();
    return tester.cal("td.minical_day_8_7_2012").shouldBe(".minical_highlighted");
  });

  test("Support integer data-minical-initial attribute", function() {
    $(".calendar :text").attr("data-minical-initial", "1381937430000");
    tester.init().focus();
    return tester.cal("td.minical_day_10_16_2013").shouldBe(".minical_highlighted");
  });

  test("Callback when date is changed", function() {
    var callback, opts;
    callback = false;
    opts = {
      date_changed: function() {
        return callback = true;
      }
    };
    tester.init(opts).focus();
    tester.cal("td.minical_day_12_21_2012 a").click();
    return ok(callback, "date_changed callback fires");
  });

  test("Callback when month is drawn", function() {
    var callback, opts;
    callback = 0;
    opts = {
      month_drawn: function() {
        return callback += 1;
      }
    };
    tester.init(opts).focus();
    tester.cal("a.minical_next").click();
    return equal(callback, 2, "month_drawn callback fires on show and month switch");
  });

  test("Allow custom date format output", function() {
    var $el, opts;
    opts = {
      date_format: function(date) {
        return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join("-");
      }
    };
    $el = tester.init(opts).focus();
    tester.cal("td.minical_day_12_21_2012 a").click();
    return $el.shouldHaveValue("21-12-2012");
  });

  test("Write initial date value by default via custom date format output if provided via data-minical-initial", function() {
    var $el, opts;
    opts = {
      date_format: function(date) {
        return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join("-");
      }
    };
    $(".calendar :text").attr("data-minical-initial", "Tue Aug 07 2012 00:00:00 GMT-0400 (EDT)").val("");
    $el = tester.init(opts).focus();
    tester.cal("td.minical_day_8_7_2012").shouldBe(".minical_highlighted");
    return $el.shouldHaveValue("7-8-2012");
  });

  QUnit.done(function() {
    return $(".minical").remove();
  });

}).call(this);