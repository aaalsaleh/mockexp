export default [
    /a/, /a|b/, /[a]/, /a*/, /a+/, /a?/, /a{2}/, /a{2,3}/, /a{2,}/, /a*?/, /a+?/, /a??/, /a{2,3}?/,
    /abc/, /abc|def/, /[a-c]/, /[abc]/, /[^ab-d]/, /abc*/, /abc+/, /abc{5}/, /abc{5,10}/, /abc{3,}/, /abc*?/, /abc+?/, /abc??/, /abc{2,3}?/,
    /abc/i, /(abc)def/, /(abc)?def/, /(abc)*def/, /(abc)+def/, /(abc){2}def/, /(abc){10,20}def/, /(abc){5,}def/, /abc(def|ghi)jkl/,
    /[abc]/i, /[abc]def/, /[abc]?def/, /[abc]*def/, /[abc]+def/, /[abc]{2}def/, /[abc]{10,20}def/, /[abc]{5,}def/, /abc[defghi]jkl/,
    /(abc|def|ghi)/, /asdf(abc|def|ghi)/, /(abc|def|ghi)asdf/, /asdf(abc|def|ghi)asdf/, /(abc)(def)(ghi)/, /(abc)+(def)*(ghi)?/,
    /(aaa(bbb|(ccc)))(ddd(eee(fff|ggg)))/, /aaa{3}bbb{4}/, /^something/, /something$/, /^something$/, /\bsomething/, /something\b/, /\bsomething\b/,
    /[abc][def]/, /[abc]{3}[def]{4}/, /abc\?/, /abc\+/, /abc\*/, /abc\w/, /abc\W/, /abc\d/, /abc\D/, /abc\s/, /abc\S/, /abc\b/, /\w/, /\W/, /\d/, /\D/, /\s/, /\S/,
    /\w\w/, /\w\W/, /\d\d/, /\d\D/, /\s\s/, /\s\S/,
    /[\w]/, /[\W]/, /[\d]/, /[\D]/, /[\s]/, /[\S]/, /[\b]/, /[\B]/,
    /[\w]*/, /[\W]*/, /[\d]*/, /[\D]*/, /[\s]*/, /[\S]*/, /[\b]*/, /[\B]*/,
    /[\w\d\s\b]*/, /[\W\D\S\B]*/, /[\w\W]*/, /[\d\D]*/, /[\s\S]*/, /[\b\B]*/, /[.]*/,
    /abc./, /.abc/, /.abc./, /abc.def/, /.abc.def/, /abc.def./, /.abc.def./,
    /abc.?/, /.?abc/, /.?abc.?/, /abc.?def/, /.?abc.?def/, /abc.?def.?/, /.?abc.?def.?/,
    /abc.*/, /.*abc/, /.*abc.*/, /abc.*def/, /.*abc.*def/, /abc.*def.*/, /.*abc.*def.*/,
    /abc.+/, /.+abc/, /.+abc.+/, /abc.+def/, /.+abc.+def/, /abc.+def.+/, /.+abc.+def.+/,
    /(abc) \1/, /(abc)* \1/, /(abc)+ \1/, /(abc){2,5} \1/, /(abc){5} \1/, /(abc(def)) \2/, /(abc)(def) \2/, /(abc)(?:def) \1/, /(?:abc)(def) \1/,
    /abc[\b]/, /[\b]abc/, /abc[\b]def/, /abc[\b][\b]def/, /abc[\b][\b][\b]/, /[\b]abc[\b]def[\b]/,

    /\d{13,16}/,
    /(?:\d[ \-]*?){13,16}/,
    /^4[0-9]{12}(?:[0-9]{3})?$/,
    /^5[1-5][0-9]{14}$/,
    /^3[47][0-9]{13}$/,
    /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    /^(?:2131|1800|35\d{3})\d{11}$/,
    /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/,

    /\b[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,4}\b/,

    /^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,4}$/,
    /^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$/,
    /(?=(\d+[\d.*]*)(?![^(]*?\)))\1/,
    /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/,
    /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/,
    /[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?/,
    /[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)/,
    /(?:[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9\-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/,
    /^([\-+]?\d{1,2}([.]\d+)?),\s*([\-+]?\d{1,3}([.]\d+)?)$/,
    /^[\-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[\-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,

    /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/,

    /^abc$/, // Matches 'abc' exactly
    /abc/, // Matches 'abc' anywhere in the string
    /\d/, // Matches any digit
    /\D/, // Matches any non-digit
    /\w/, // Matches any word character (alphanumeric or underscore)
    /\W/, // Matches any non-word character
    /\s/, // Matches any whitespace character
    /\S/, // Matches any non-whitespace character
    /a|b/, // Matches 'a' or 'b'
    /a*/, // Matches 'a' zero or more times
    /a+/, // Matches 'a' one or more times
    /a?/, // Matches 'a' zero or one times
    /a{3}/, // Matches 'a' exactly three times
    /a{3,}/, // Matches 'a' three or more times
    /a{3,6}/, // Matches 'a' between three and six times
    /a.b/, // Matches 'a', any character, then 'b'
    /^abc/, // Matches 'abc' at the start of the string
    /abc$/, // Matches 'abc' at the end of the string
    /\babc\b/, // Matches 'abc' as a whole word
    /a\sb/, // Matches 'a', a whitespace, then 'b'
    /a[^b]c/, // Matches 'a', any character except 'b', then 'c'
    /(abc)/, // Matches 'abc' and remembers the match
    /a(?=b)/, // Matches 'a' only if 'a' is followed by 'b'
    /a(?!b)/, // Matches 'a' only if 'a' is not followed by 'b'
    /(?<=b)a/, // Matches 'a' only if 'a' is preceded by 'b'
    /(?<!b)a/, // Matches 'a' only if 'a' is not preceded by 'b'
    /a{2,}?/, // Matches 'a' two or more times, but as few times as possible
    /a*?/, // Matches 'a' zero or more times, but as few times as possible
    /a+?/, // Matches 'a' one or more times, but as few times as possible
    /a??/, // Matches 'a' zero or one times, but as few times as possible
    /\d{2,4}/, // Matches between 2 and 4 digits
    /\b\d{4}\b/, // Matches exactly 4 digits
    /\b\w{6,12}\b/, // Matches between 6 and 12 word characters
    /[aeiou]/, // Matches any vowel
    /[^aeiou]/, // Matches any non-vowel
    /\d{1,2}\/\d{1,2}\/\d{4}/, // Matches a date in mm/dd/yyyy format
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Matches an email address
    /https?:\/\/[^\s/$.?#].[^\s]*/, // Matches a URL
    /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, // Matches an email address
    /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // Matches an IP address
    /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/, // Matches a phone number
    /^\d{5}(-\d{4})?$/, // Matches a zip code
    /^[a-z0-9_-]{3,16}$/, // Matches a username
    /^[a-z0-9_-]{6,18}$/, // Matches a password
    /^#?([a-f0-9]{6}|[a-f0-9]{3})$/, // Matches a hex color
    /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, // Matches an email address
    /^https?:\/\/?[\da-z\.-]+\.[a-z\.]{2,6}([\/\w \.-]*)*\/?$/, // Matches a URL
    /^([1-9][0-9]{0,2}(,([0-9]{3})*|[0-9]*)(\.[0-9]{1,2})?|[1-9][0-9]{0,}(\.[0-9]{1,2})?|0(\.[0-9]{1,2})?|(,[0-9]{3})*|[0-9]*)(\.[0-9]{1,2})?$/, // Matches a number with commas and decimals
    /^([a-z0-9]{5,})$/, // Matches a lowercase alphanumeric string with length of at least 5
    /^([A-Z]{3,})$/, // Matches an uppercase string with length of at least 3
    /^([a-zA-Z]{2,})$/, // Matches a string with at least 2 alphabetic characters

    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, // Password validation: At least one number, one uppercase and one lowercase letter. At least eight characters
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}/, // Password validation: At least one number, one uppercase and one lowercase letter, no whitespace. At least eight characters
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,15}/, // Password validation: At least one number, one uppercase and one lowercase letter, no whitespace. Between eight and fifteen characters
    /(?<=\d)(?=\D)/, // Positive lookbehind for a digit, positive lookahead for a non-digit
    /(?<!\d)(?=\D)/, // Negative lookbehind for a digit, positive lookahead for a non-digit
    /(?<=\D)(?=\d)/, // Positive lookbehind for a non-digit, positive lookahead for a digit
    /(?<!\D)(?=\d)/, // Negative lookbehind for a non-digit, positive lookahead for a digit
    /(?<=\d)(?!\D)/, // Positive lookbehind for a digit, negative lookahead for a non-digit
    /(?<!\d)(?!\D)/, // Negative lookbehind for a digit, negative lookahead for a non-digit
    /(?<=\D)(?!\d)/, // Positive lookbehind for a non-digit, negative lookahead for a digit
    /(?<!\D)(?!\d)/, // Negative lookbehind for a non-digit, negative lookahead for a digit
    /(abc)\1/, // Matches 'abcabc'
    /(abc)\1\1/, // Matches 'abcabcabc'
    /(abc)\1{2,}/, // Matches 'abc' repeated 2 or more times
    /(abc)\1{2,4}/, // Matches 'abc' repeated between 2 and 4 times
    /(abc)(def)\1\2/, // Matches 'abcdefabcdef'
    /(abc)(def)\2\1/, // Matches 'abcdefdefabc'
    /(abc|def)\1/, // Matches 'abcabc' or 'defdef'
    /(abc|def)\1\1/, // Matches 'abcabcabc' or 'defdefdef'
    /(abc|def)\1{2,}/, // Matches 'abc' or 'def' repeated 2 or more times
    /(abc|def)\1{2,4}/, // Matches 'abc' or 'def' repeated between 2 and 4 times
    /(abc)(def|ghi)\1\2/, // Matches 'abcdefabcdef' or 'abcghiabcghi'
    /(abc)(def|ghi)\2\1/, // Matches 'abcdefdefabc' or 'abcghighiabc'

    /((?:abc)+)(def|ghi)*\2\1\1/, // Matches 'abcdefdefabcdef' or 'abcghighiabcghi'
    /((?:abc)+)(def|ghi)*\1\2{2,}/, // Matches 'abcdefabcdefabcdef' or 'abcghiabcghiabcghi'
    /((?:abc)+)(def|ghi)*\1\2{2,4}/, // Matches 'abc' followed by 'def' or 'ghi', repeated between 2 and 4 times
    /((?:abc)+)(def|ghi)*\2\1{2,}/, // Matches 'def' or 'ghi' followed by 'abc', repeated 2 or more times
    /((?:abc)+)(def|ghi)*\2\1{2,4}/, // Matches 'def' or 'ghi' followed by 'abc', repeated between 2 and 4 times
    /((?:abc)+)(def|ghi)*\1\2\1/, // Matches 'abcdefabcghiabc' or 'abcghiabcdefabc'
    /((?:abc)+)(def|ghi)*\2\1\2/, // Matches 'defabcghidef' or 'ghiabcdefghi'
    /((?:abc)+)(def|ghi)*\1\2\1\2/, // Matches 'abcdefabcghidef' or 'abcghiabcdefghi'
    /((?:abc)+)(def|ghi)*\2\1\2\1/, // Matches 'defabcghidefabc' or 'ghiabcdefghiabc'
    /((?:abc)+)(def|ghi)*\1\2\1\2\1/, // Matches 'abcdefabcghidefabc' or 'abcghiabcdefghiabc'
    /((?:abc)+)(def|ghi)*\2\1\2\1\2/, // Matches 'defabcghidefabcghi' or 'ghiabcdefghiabcdef'
    /((?:abc)+)(def|ghi)*\1\2\1\2\1\2/, // Matches 'abcdefabcghidefabcghi' or 'abcghiabcdefghiabcdef'
    /((?:abc)+)(def|ghi)*\2\1\2\1\2\1/, // Matches 'defabcghidefabcghidef' or 'ghiabcdefghiabcdefghi'
    /((?:abc)+)(def|ghi)*\1\2\1\2\1\2\1/, // Matches 'abcdefabcghidefabcghidef' or 'abcghiabcdefghiabcdefghi'
    /((?:abc)+)(def|ghi)*\2\1\2\1\2\1\2/, // Matches 'defabcghidefabcghidefabc' or 'ghiabcdefghiabcdefghiabc'
    /((?:abc)+)(def|ghi)*\1\2\1\2\1\2\1\2/, // Matches 'abcdefabcghidefabcghidefabc' or 'abcghiabcdefghiabcdefghiabc'
    /((?:abc)+)(def|ghi)*\2\1\2\1\2\1\2\1/, // Matches 'defabcghidefabcghidefabcghi' or 'ghiabcdefghiabcdefghiabcdef'

    /a{2}/,
    /a{2/,
    /a\{2}/,
    /a\{2\}/,

    /\0/,
    /\1/,
    /\377/,
    /\n/,
    /\N/,
    /\v/,
    /\V/,
    /\r/,
    /\R/,
    /\f/,
    /\F/,
    /\t/,
    /\T/,
    /\s/,
    /\S/,
    /\w/,
    /\W/,
    /\d/,
    /\D/,
    /\cA/,
    /\cAb/,
    /\ca/,
    /\cab/,
    /\u00AA/,
    /\u00AAc/,
    /\u00bb/,
    /\u00bbc/,
    /\xA1d/,
    /\xCC/,
    /\xcc/,
    /\xcce/,
    /\y/,
    /\y1/,
    /\yy/,
    /\\yx/,

    /[\cA1]{10}/,
    /[\ca1]{10}/,
    /[\366]{10}/,
    /[\8]{10}/,
    /\p{something}/,
    /[\p]{10}/,

    /a\a/,

    /\1ab/,
    /\1(ab)/,
    /\22(ab)(c)/,

    /[abc]+(?<!bb|cc)/,
    /abc\B/,
    /[\Babc]/,

    /abc\1/,
    /(abc)\1/,
    /\1abc/,
    /\1(abc)/,

    /\8(abc)(def)(abc)(def)(abc)(def)(abc)(def)/,
    /(abc)(def)(abc)(def)(abc)(def)(abc)(def)\8/,

    /(?<named>abc)\named/,
    /(?<named>abc)\k<named>/,
    /(?<named>abc)\k<named>\1/,
    /\k<named>(?<named>abc)/,
    /(abc)\k<named>/,
    /(abc)\k<abc/,
    /(abc)\k<>/,
    /(abc)\k</,
    /(abc)\k/,

    /[.]/,
    /[.]+/,
    /[\w]/,

    /\u{1F600}{5}/,
    /\u{1F600}{3,5}/u,
    /[\u{1F600}]{5}/,
    /[\u{1F600}-\u{1F610}]{5}/u,

    /😊+/,
    /😊+/u,

    /[a-z]/i,
    /[Q-d]/i,
    /[^a-z]/i,
    /[^Q-d]/i,

    /\d{0}/,

    /(?=(\d+))\1abc\1/,
    /(?=(\d+)).{10,20}\1/,
    /(?!(\d+))abc\1/,
    /(?!(\d+)).{10,20}\1/,

    /(?<=@)\w+/,
    /\w+(?=@)/,
    /(?<!@)\w+/,
    /\w+(?!@)/,

    /(?=.*@+).*/,
];
