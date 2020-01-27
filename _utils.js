const clickXPath = page => async selector => {
  await page.waitForXPath(selector);
  const [element] = await page.$x(selector);

  if (element) {
    console.log(selector, "클릭");
    await element.click();
  }

  return null;
};

const clickText = page => (...selectors) => text => {
  selectors = selectors
    .map(s => (s.startsWith(".") ? `\*[contains(@class, "${s.slice(1)}")]` : s))
    .join("//");

  return clickXPath(page)(`//${selectors}[text()="${text}"]`);
};

const clickHasInnerText = page => (...selectors) => text => {
  selectors = selectors
    .map(s => (s.startsWith(".") ? `\*[contains(@class, "${s.slice(1)}")]` : s))
    .join("//");

  return clickXPath(page)(`//${selectors}[contains(., '${text}')]`);
};

const clickHasText = page => (...selectors) => text => {
  selectors = selectors
    .map(s => (s.startsWith(".") ? `\*[contains(@class, "${s.slice(1)}")]` : s))
    .join("//");

  return clickXPath(page)(`//${selectors}[contains(text(), '${text}')]`);
};

const existSelector = page => async selector =>
  (await page.$(selector)) !== null;

const existXPath = page => async selector =>
  (await page.$x(selector)).length !== 0;

const fill = page => async (selector, value) => {
  await page.evaluate(
    (selector, value) => {
      const target = document.querySelector(selector);
      target && (target.value = value);
    },
    selector,
    value
  );

  return page.type(selector, "");
};

const clickAll = page => async selector => {
  return page.evaluate(selector => {
    let elements = document.querySelectorAll(selector);
    console.log("click All", elements.length);
    if (elements.length) for (let element of elements) element.click();
  }, selector);
};

module.exports = {
  clickXPath,
  clickText,
  clickHasText,
  clickHasInnerText,
  existSelector,
  existXPath,
  clickAll,
  fill
};
