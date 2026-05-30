import {
  type DeviceIdentifier,
  duoLayer,
  ifDevice,
  ifKeyboardType,
  layer,
  map,
  rule,
  writeToProfile,
} from "karabiner.ts";

const MXKEYS_USB: DeviceIdentifier = { vendor_id: 1133, product_id: 50504 };
const MXKEYS_BLT: DeviceIdentifier = { vendor_id: 1133, product_id: 45929 };
const MBA_M4: DeviceIdentifier = { is_built_in_keyboard: true };
const MBA_M1: DeviceIdentifier = { vendor_id: 1452, product_id: 641 };
const CORNE_CHERRY: DeviceIdentifier = { vendor_id: 18003, product_id: 1 };
const JIS = ifKeyboardType("jis");

// const ifNotTerminal = () =>
//   ifApp([
//     "com.mitchellh.ghostty",
//     "com.github.wez.wezterm",
//     "com.apple.Terminal",
//   ]).unless();

writeToProfile("karabiner-ts", [
  rule("all keyboards").manipulators([
    map("japanese_eisuu", {
      optional: ["left_command", "control", "option", "shift", "fn"],
    })
      .to("left_command")
      .toIfAlone("japanese_eisuu"),
    map("left_command", "?any").to("left_option"),
    map("slash").to("right_shift").toIfAlone("slash"),
  ]),

  rule("internal keyboard").manipulators(
    [
      map("right_command", {
        optional: ["right_command", "shift", "control", "option", "fn"],
      }).to("right_option"),
      map("caps_lock", "?any").to("fn"),
      // backslash
      map("international1").to("international3"),
      // underbar
      map("international1", "left_shift").to("international1"),
    ]
      .map((rule) => rule.condition(ifDevice([MBA_M1, MBA_M4]))),
  ),

  rule("corne cherry").manipulators(
    [
      map("japanese_pc_nfer", "?any")
        .to("left_command")
        .toIfAlone("japanese_eisuu"),
      // underbar
      map("backslash", "left_shift").to("international1"),
      // backslach
      map("backslash")
        .to("right_shift")
        .toIfAlone("international3"),
      // accent grave
      map("backslash", "left_option").to("international1", "left_option")
    ].map((rule) => rule.condition(ifDevice(CORNE_CHERRY))),
  ),

  rule("mx keys").manipulators(
    [
      map("caps_lock", "?any").to("left_control"),
      map("left_control", "?any").to("fn"),
    ].map((rule) => rule.condition(ifDevice([MXKEYS_USB, MXKEYS_BLT]))),
  ),

  rule("colons & quotes").manipulators([
    map("quote").to(7, "shift").condition(JIS),
    map("quote", "shift").to(2, "shift").condition(JIS),
    map("semicolon", "shift").to("quote").condition(JIS),
  ]),

  rule("emacs")
    .manipulators([
      map("m", "control").to("return_or_enter"),
      map("m", ["left_control", "left_command"]).to(
        "return_or_enter",
        "left_command",
      ),
      map("m", ["left_control", "left_shift"]).to(
        "return_or_enter",
        "left_shift",
      ),
      map("h", "control").to("delete_or_backspace"),
      map("h", ["left_control", "left_command"]).to(
        "delete_or_backspace",
        "left_command",
      ),
      map("n", "control").to("down_arrow"),
      map("p", "control").to("up_arrow"),
      map("f", "control").to("right_arrow"),
      map("b", "control").to("left_arrow"),
    ]),

  layer("japanese_kana")
    .description("kana-mode")
    .modifiers("?any")
    .manipulators([
      // esc
      map("spacebar").to("escape").to("japanese_eisuu").condition(JIS),

      // symbols
      map("q").to("grave_accent_and_tilde").condition(JIS),
      map("w").to("hyphen").condition(JIS),
      map("e").to("hyphen", "shift").condition(JIS),
      map("r").to("equal_sign", "shift").condition(JIS),
      map("t").to("hyphen").condition(JIS),
      map("a").to("open_bracket").condition(JIS),
      map("s").to(3, "shift").condition(JIS),
      map("d").to(4, "shift").condition(JIS),
      map("f").to(1, "shift").condition(JIS),
      map("g").to("semicolon", "shift").condition(JIS),
      map("z").to(5, "shift").condition(JIS),
      map("x").to("quote", "shift").condition(JIS),
      map("c").to("equal_sign").condition(JIS),
      map("v").to("international3", "shift").condition(JIS),
      map("b").to(6, "shift").condition(JIS),

      // vi cursor
      map("h", "?any").to("left_arrow"),
      map("j", "?any").to("down_arrow"),
      map("k", "?any").to("up_arrow"),
      map("l", "?any").to("right_arrow"),
    ]),

  layer("semicolon")
    .description("parenthesis")
    .modifiers("?any")
    .manipulators([
      map("u", "?any").to(8, "shift").condition(JIS),
      map("i", "?any").to(9, "shift").condition(JIS),
      map("j", "?any").to("close_bracket").condition(JIS),
      map("k", "?any").to("backslash").condition(JIS),
      map("m", "?any").to("close_bracket", "shift").condition(JIS),
      map(",", "?any").to("backslash", "shift").condition(JIS),
    ]),

  duoLayer("tab", "q")
    .description("window control")
    .manipulators([
      map("h").to("left_arrow", "⌥⌃"),
      map("j").to("down_arrow", "⌥⌃"),
      map("k").to("up_arrow", "⌥⌃"),
      map("l").to("right_arrow", "⌥⌃"),
      map("u").to("d", "⌥⌃"),
      map("i").to("f", "⌥⌃"),
      map("o").to("g", "⌥⌃"),
      map("m").to("e", "⌥⌃"),
      map("comma").to("return_or_enter", "⌥⌃"),
      map("period").to("t", "⌥⌃"),
      map("y").to("u", "⌥⌃"),
      map("n").to("j", "⌥⌃"),
      map("p").to("i", "⌥⌃"),
      map("p").to("k", "⌥⌃"),
    ]),

  duoLayer("d", "f").description("numbers")
    .manipulators([
      map("japanese_kana", "?any").to(0),
      map("n", "?any").to(0),
      map("m", "?any").to(1),
      map(",", "?any").to(2),
      map(".", "?any").to(3),
      map("j", "?any").to(4),
      map("k", "?any").to(5),
      map("l", "?any").to(6),
      map("u", "?any").to(7),
      map("i", "?any").to(8),
      map("o", "?any").to(9),
    ]),
]);
