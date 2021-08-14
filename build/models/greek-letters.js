"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toUpperCase = toUpperCase;
exports.isUpperCase = isUpperCase;
exports.getSymbol = getSymbol;
exports.getName = getName;
exports.convertSymbols = convertSymbols;
exports.default = exports.letters = void 0;

var _logger = require("../logger");

const letters = [{
  name: 'alpha',
  symbol: 'α'
}, {
  name: 'beta',
  symbol: 'β'
}, {
  name: 'gamma',
  symbol: 'γ'
}, {
  name: 'delta',
  symbol: 'δ'
}, {
  name: 'epsilon',
  symbol: 'ϵ'
}, {
  name: 'zeta',
  symbol: 'ζ'
}, {
  name: 'eta',
  symbol: 'η'
}, {
  name: 'theta',
  symbol: 'θ'
}, {
  name: 'iota',
  symbol: 'ι'
}, {
  name: 'kappa',
  symbol: 'κ'
}, {
  name: 'lambda',
  symbol: 'λ'
}, {
  name: 'mu',
  symbol: 'μ'
}, {
  name: 'nu',
  symbol: 'ν'
}, {
  name: 'omicron',
  symbol: 'ο'
}, {
  name: 'pi',
  symbol: 'π'
}, {
  name: 'rho',
  symbol: 'ρ'
}, {
  name: 'sigma',
  symbol: 'σ'
}, {
  name: 'tau',
  symbol: 'τ'
}, {
  name: 'upsilon',
  symbol: 'υ'
}, {
  name: 'phi',
  symbol: 'ϕ'
}, {
  name: 'chi',
  symbol: 'χ'
}, {
  name: 'psi',
  symbol: 'ψ'
}, {
  name: 'omega',
  symbol: 'ω'
}];
exports.letters = letters;

function toUpperCase(x) {
  return x.charAt(0).toUpperCase() + x.slice(1);
}

function isUpperCase(x) {
  return x.charAt(0).toUpperCase() === x.charAt(0);
}

function getSymbol(name) {
  const symbol = letters.find(x => x.name === name.toLowerCase());
  if (typeof symbol === 'undefined') return null;
  let symbolText = symbol.symbol;
  if (isUpperCase(name)) symbolText = toUpperCase(symbolText);
  return symbolText;
}

function getName(symbol) {
  const name = letters.find(x => x.symbol === symbol.toLowerCase());
  if (typeof name === 'undefined') return null;
  let nameText = name.name;
  if (isUpperCase(symbol)) nameText = toUpperCase(nameText);
  return nameText;
}

function convertSymbols(math) {
  (0, _logger.debug)('Converting math symbols ' + math);
  letters.forEach(letter => {
    math = math.split(letter.symbol).join(letter.name);
    math = math.split(toUpperCase(letter.symbol)).join(toUpperCase(letter.name));
  });
  (0, _logger.debug)('Converted math symbols ' + math);
  return math;
}

var _default = letters;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvZ3JlZWstbGV0dGVycy50cyJdLCJuYW1lcyI6WyJsZXR0ZXJzIiwibmFtZSIsInN5bWJvbCIsInRvVXBwZXJDYXNlIiwieCIsImNoYXJBdCIsInNsaWNlIiwiaXNVcHBlckNhc2UiLCJnZXRTeW1ib2wiLCJmaW5kIiwidG9Mb3dlckNhc2UiLCJzeW1ib2xUZXh0IiwiZ2V0TmFtZSIsIm5hbWVUZXh0IiwiY29udmVydFN5bWJvbHMiLCJtYXRoIiwiZm9yRWFjaCIsImxldHRlciIsInNwbGl0Iiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRU8sTUFBTUEsT0FBTyxHQUFHLENBQ3JCO0FBQ0VDLEVBQUFBLElBQUksRUFBRSxPQURSO0FBRUVDLEVBQUFBLE1BQU0sRUFBRTtBQUZWLENBRHFCLEVBS3JCO0FBQ0VELEVBQUFBLElBQUksRUFBRSxNQURSO0FBRUVDLEVBQUFBLE1BQU0sRUFBRTtBQUZWLENBTHFCLEVBU3JCO0FBQ0VELEVBQUFBLElBQUksRUFBRSxPQURSO0FBRUVDLEVBQUFBLE1BQU0sRUFBRTtBQUZWLENBVHFCLEVBYXJCO0FBQ0VELEVBQUFBLElBQUksRUFBRSxPQURSO0FBRUVDLEVBQUFBLE1BQU0sRUFBRTtBQUZWLENBYnFCLEVBaUJyQjtBQUNFRCxFQUFBQSxJQUFJLEVBQUUsU0FEUjtBQUVFQyxFQUFBQSxNQUFNLEVBQUU7QUFGVixDQWpCcUIsRUFxQnJCO0FBQ0VELEVBQUFBLElBQUksRUFBRSxNQURSO0FBRUVDLEVBQUFBLE1BQU0sRUFBRTtBQUZWLENBckJxQixFQXlCckI7QUFDRUQsRUFBQUEsSUFBSSxFQUFFLEtBRFI7QUFFRUMsRUFBQUEsTUFBTSxFQUFFO0FBRlYsQ0F6QnFCLEVBNkJyQjtBQUNFRCxFQUFBQSxJQUFJLEVBQUUsT0FEUjtBQUVFQyxFQUFBQSxNQUFNLEVBQUU7QUFGVixDQTdCcUIsRUFpQ3JCO0FBQ0VELEVBQUFBLElBQUksRUFBRSxNQURSO0FBRUVDLEVB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Q0EsTUFBSU0sV0FBVyxDQUFDTCxNQUFELENBQWYsRUFBeUJXLFFBQVEsR0FBR1YsV0FBVyxDQUFDVSxRQUFELENBQXRCO0FBQ3pCLFNBQU9BLFFBQVA7QUFDRDs7QUFFTSxTQUFTQyxjQUFULENBQXdCQyxJQUF4QixFQUFzQztBQUMzQyxxQkFBTSw2QkFBNkJBLElBQW5DO0FBQ0FmLEVBQUFBLE9BQU8sQ0FBQ2dCLE9BQVIsQ0FBZ0JDLE1BQU0sSUFBSTtBQUN4QkYsSUFBQUEsSUFBSSxHQUFHQSxJQUFJLENBQUNHLEtBQUwsQ0FBV0QsTUFBTSxDQUFDZixNQUFsQixFQUEwQmlCLElBQTFCLENBQStCRixNQUFNLENBQUNoQixJQUF0QyxDQUFQO0FBQ0FjLElBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDRyxLQUFMLENBQVdmLFdBQVcsQ0FBQ2MsTUFBTSxDQUFDZixNQUFSLENBQXRCLEVBQXVDaUIsSUFBdkMsQ0FBNENoQixXQUFXLENBQUNjLE1BQU0sQ0FBQ2hCLElBQVIsQ0FBdkQsQ0FBUDtBQUNELEdBSEQ7QUFJQSxxQkFBTSw0QkFBNEJjLElBQWxDO0FBQ0EsU0FBT0EsSUFBUDtBQUNEOztlQUVjZixPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVidWcgfSBmcm9tICcuLi9sb2dnZXInXHJcblxyXG5leHBvcnQgY29uc3QgbGV0dGVycyA9IFtcclxuICB7XHJcbiAgICBuYW1lOiAnYWxwaGEnLFxyXG4gICAgc3ltYm9sOiAnzrEnLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogJ2JldGEnLFxyXG4gICAgc3ltYm9sOiAnzrInLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogJ2dhbW1hJyxcclxuICAgIHN5bWJvbDogJ86zJyxcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICdkZWx0YScsXHJcbiAgICBzeW1ib2w6ICfOtCcsXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAnZXBzaWxvbicsXHJcbiAgICBzeW1ib2w6ICfPtScsXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAnemV0YScsXHJcbiAgICBzeW1ib2w6ICfOticsXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAnZXRhJyxcclxuICAgIHN5bWJvbDogJ863JyxcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICd0aGV0YScsXHJcbiAgICBzeW1ib2w6ICfOuCcsXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAnaW90YScsXHJcbiAgICBzeW1ib2w6ICfOuScsXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAna2FwcGEnLFxyXG4gICAgc3ltYm9sOiAnzronLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogJ2xhbWJkYScsXHJcbiAgICBzeW1ib2w6ICfOuycsXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAnbXUnLFxyXG4gICAgc3ltYm9sOiAnzrwnLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogJ251JyxcclxuICAgIHN5bWJvbDogJ869JyxcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICdvbWljcm9uJyxcclxuICAgIHN5bWJvbDogJ86/JyxcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICdwaScsXHJcbiAgICBzeW1ib2w6ICfPgCcsXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAncmhvJyxcclxuICAgIHN5bWJvbDogJ8+BJyxcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICdzaWdtYScsXHJcbiAgICBzeW1ib2w6ICfPgycsXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAndGF1JyxcclxuICAgIHN5bWJvbDogJ8+EJyxcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICd1cHNpbG9uJyxcclxuICAgIHN5bWJvbDogJ8+FJyxcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICdwaGknLFxyXG4gICAgc3ltYm9sOiAnz5UnLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogJ2NoaScsXHJcbiAgICBzeW1ib2w6ICfPhycsXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiAncHNpJyxcclxuICAgIHN5bWJvbDogJ8+IJyxcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6ICdvbWVnYScsXHJcbiAgICBzeW1ib2w6ICfPiScsXHJcbiAgfSxcclxuXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvVXBwZXJDYXNlKHg6IHN0cmluZykge1xyXG4gIHJldHVybiB4LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgeC5zbGljZSgxKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNVcHBlckNhc2UoeDogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHguY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgPT09IHguY2hhckF0KDApXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTeW1ib2wobmFtZTogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3ltYm9sID0gbGV0dGVycy5maW5kKHggPT4geC5uYW1lID09PSBuYW1lLnRvTG93ZXJDYXNlKCkpXHJcbiAgaWYgKHR5cGVvZiBzeW1ib2wgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gbnVsbFxyXG4gIGxldCBzeW1ib2xUZXh0ID0gc3ltYm9sLnN5bWJvbFxyXG4gIGlmIChpc1VwcGVyQ2FzZShuYW1lKSkgc3ltYm9sVGV4dCA9IHRvVXBwZXJDYXNlKHN5bWJvbFRleHQpXHJcbiAgcmV0dXJuIHN5bWJvbFRleHRcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE5hbWUoc3ltYm9sOiBzdHJpbmcpIHtcclxuICBjb25zdCBuYW1lID0gbGV0dGVycy5maW5kKHggPT4geC5zeW1ib2wgPT09IHN5bWJvbC50b0xvd2VyQ2FzZSgpKVxyXG4gIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBudWxsXHJcbiAgbGV0IG5hbWVUZXh0ID0gbmFtZS5uYW1lXHJcbiAgaWYgKGlzVXBwZXJDYXNlKHN5bWJvbCkpIG5hbWVUZXh0ID0gdG9VcHBlckNhc2UobmFtZVRleHQpXHJcbiAgcmV0dXJuIG5hbWVUZXh0XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0U3ltYm9scyhtYXRoOiBzdHJpbmcpIHtcclxuICBkZWJ1ZygnQ29udmVydGluZyBtYXRoIHN5bWJvbHMgJyArIG1hdGgpXHJcbiAgbGV0dGVycy5mb3JFYWNoKGxldHRlciA9PiB7XHJcbiAgICBtYXRoID0gbWF0aC5zcGxpdChsZXR0ZXIuc3ltYm9sKS5qb2luKGxldHRlci5uYW1lKVxyXG4gICAgbWF0aCA9IG1hdGguc3BsaXQodG9VcHBlckNhc2UobGV0dGVyLnN5bWJvbCkpLmpvaW4odG9VcHBlckNhc2UobGV0dGVyLm5hbWUpKVxyXG4gIH0pXHJcbiAgZGVidWcoJ0NvbnZlcnRlZCBtYXRoIHN5bWJvbHMgJyArIG1hdGgpXHJcbiAgcmV0dXJuIG1hdGhcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbGV0dGVyc1xyXG4iXX0=