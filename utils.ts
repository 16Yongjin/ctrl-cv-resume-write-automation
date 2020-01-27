import { Page } from "puppeteer";

const aggregateSelectors = (selectors: string[]): string =>
  selectors
    .map(s => (s.startsWith(".") ? `\*[contains(@class, "${s.slice(1)}")]` : s))
    .join("//");

export const clickXPath = (page: Page) => async (selector: string) => {
  await page.waitForXPath(selector);
  const [element] = await page.$x(selector);

  if (element) {
    console.log(selector, "클릭");
    await element.click();
  }

  return null;
};

export const clickText = (page: Page) => (...selectors: string[]) => (
  text: string
) => {
  const selector = aggregateSelectors(selectors);

  return clickXPath(page)(`//${selector}[text()="${text}"]`);
};

export const clickHasInnerText = (page: Page) => (...selectors: string[]) => (
  text: string
) => {
  const selector = aggregateSelectors(selectors);

  return clickXPath(page)(`//${selector}[contains(., '${text}')]`);
};

export const clickHasText = (page: Page) => (...selectors: string[]) => (
  text: string
) => {
  const selector = aggregateSelectors(selectors);

  return clickXPath(page)(`//${selector}[contains(text(), '${text}')]`);
};

export const existSelector = (page: Page) => async (selector: string) =>
  (await page.$(selector)) !== null;

export const existXPath = (page: Page) => async (selector: string) =>
  (await page.$x(selector)).length !== 0;

export const fill = (page: Page) => async (selector: string, value: string) => {
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

export const fillIfEmpty = (page: Page) => async (
  selector: string,
  value: string
) => {
  await page.evaluate(
    (selector, value) => {
      const target = document.querySelector(selector);
      if (target && !target.value) {
        target.value = value;
      }
    },
    selector,
    value
  );

  return page.type(selector, "");
};

export const findInList = (page: Page) => async (
  listSelector: string,
  value: string
) => {
  return page.evaluate(
    (selector, value) => {
      let elements: HTMLElement[] = Array.from(
        document.querySelectorAll(selector)
      );
      const res = elements.find(
        i => i.textContent.toLowerCase() === value.toLowerCase()
      );

      return res && res.textContent;
    },
    listSelector,
    value
  );
};

export const clickAll = (page: Page) => async (selector: string) => {
  return page.evaluate(selector => {
    let elements: HTMLElement[] = Array.from(
      document.querySelectorAll(selector)
    );
    console.log("click All", elements.length);
    if (elements.length) for (let element of elements) element.click();
  }, selector);
};

export const clickEval = (page: Page) => async (selector: string) => {
  return page.evaluate(selector => {
    let element: HTMLElement = document.querySelector(selector);
    console.log("clickEval", element);

    if (element) element.click();
  }, selector);
};

export const isVisible = (page: Page) => (selector: string) =>
  page.$eval(
    selector,
    elem => window.getComputedStyle(elem).getPropertyValue("display") !== "none"
  );

export const isHidden = (page: Page) => async (selector: string) =>
  !(await isVisible(page)(selector));
