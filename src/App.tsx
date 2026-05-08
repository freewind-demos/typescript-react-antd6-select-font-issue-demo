import type {FC} from "react";
import {useEffect, useRef, useState} from "react";
import {Button, Input, Select, Typography} from "antd";

const noneLangValue = "__none__";
const emptyFontValue = "(未取到)";
const sampleText = "Ag 字体 ABC 中文 123";

const langOptions = [
  {value: "zh-CN", label: "中文 zh-CN"},
  {value: "en", label: "English en"},
  {value: noneLangValue, label: "不设 lang"},
];

const fontOptions = [
  {value: "serif", label: "Serif"},
  {value: "sans", label: "Sans"},
  {value: "mono", label: "Mono"},
] as const;

const selectOptions = [
  {value: "sample-1", label: sampleText},
  {value: "sample-2", label: "Only Latin ABC 123"},
];

type FontMode = (typeof fontOptions)[number]["value"];

type SampleKey =
  | "scope"
  | "plainText"
  | "antdTypography"
  | "nativeInput"
  | "antdInput"
  | "nativeTextarea"
  | "antdTextarea"
  | "nativeButton"
  | "antdButton"
  | "nativeSelect"
  | "antdSelectRoot"
  | "antdSelectValue";

type Snapshot = Record<SampleKey, string>;

type SampleRow = {
  key: SampleKey;
  name: string;
  font: string;
};

const demoCss = `
  .demo-scope {
    width: 100%;
    border-collapse: collapse;
  }

  .demo-sample-select {
    padding: 8px 12px;
  }

  .demo-sample-input,
  .demo-sample-textarea,
  .demo-sample-input,
  .demo-sample-textarea {
    width: 100%;
    padding: 8px 12px;
  }

  .demo-sample-button {
    padding: 8px 12px;
  }

  .demo-scope th,
  .demo-scope td {
    padding: 12px 16px;
    border: 1px solid #d9d9d9;
    vertical-align: top;
  }

  .demo-scope td:nth-child(2) {
    line-height: 1.5;
  }

  .demo-font-table {
    width: 100%;
    border-collapse: collapse;
  }

  .demo-font-table th,
  .demo-font-table td {
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    vertical-align: top;
  }

  .demo-font-note {
    color: #595959;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-all;
  }

  .demo-ant-row {
    background: #fafafa;
  }

  .demo-font-note-alert {
    color: #cf1322;
  }
`;

const getFontFamily = (element: Element | null) =>
  element ? getComputedStyle(element).fontFamily : emptyFontValue;

const getQueryFontFamily = (root: HTMLElement | null, selector: string) =>
  getFontFamily(root?.querySelector(selector) ?? null);

const getInitialSnapshot = (): Snapshot => ({
  scope: emptyFontValue,
  plainText: emptyFontValue,
  antdTypography: emptyFontValue,
  nativeInput: emptyFontValue,
  antdInput: emptyFontValue,
  nativeTextarea: emptyFontValue,
  antdTextarea: emptyFontValue,
  nativeButton: emptyFontValue,
  antdButton: emptyFontValue,
  nativeSelect: emptyFontValue,
  antdSelectRoot: emptyFontValue,
  antdSelectValue: emptyFontValue,
});

const App: FC = () => {
  const [htmlLang, setHtmlLang] = useState(
    document.documentElement.getAttribute("lang") ?? noneLangValue,
  );
  const [fontMode, setFontMode] = useState<FontMode>("serif");
  const [snapshot, setSnapshot] = useState<Snapshot>(getInitialSnapshot);
  const scopeRef = useRef<HTMLTableElement>(null);
  const plainTextRef = useRef<HTMLSpanElement>(null);
  const antdTypographyRef = useRef<HTMLDivElement>(null);
  const nativeInputRef = useRef<HTMLInputElement>(null);
  const antdInputRef = useRef<HTMLDivElement>(null);
  const nativeTextareaRef = useRef<HTMLTextAreaElement>(null);
  const antdTextareaRef = useRef<HTMLDivElement>(null);
  const nativeButtonRef = useRef<HTMLButtonElement>(null);
  const antdButtonRef = useRef<HTMLDivElement>(null);
  const nativeSelectRef = useRef<HTMLSelectElement>(null);
  const antdSelectRef = useRef<HTMLDivElement>(null);

  const updateSnapshot = () => {
    setSnapshot({
      scope: getFontFamily(scopeRef.current),
      plainText: getFontFamily(plainTextRef.current),
      antdTypography: getQueryFontFamily(
        antdTypographyRef.current,
        ".ant-typography",
      ),
      nativeInput: getFontFamily(nativeInputRef.current),
      antdInput: getQueryFontFamily(antdInputRef.current, "input"),
      nativeTextarea: getFontFamily(nativeTextareaRef.current),
      antdTextarea: getQueryFontFamily(antdTextareaRef.current, "textarea"),
      nativeButton: getFontFamily(nativeButtonRef.current),
      antdButton: getQueryFontFamily(antdButtonRef.current, "button"),
      nativeSelect: getFontFamily(nativeSelectRef.current),
      antdSelectRoot: getQueryFontFamily(antdSelectRef.current, ".ant-select"),
      antdSelectValue: getQueryFontFamily(
        antdSelectRef.current,
        ".ant-select-content",
      ),
    });
  };

  useEffect(() => {
    if (htmlLang === noneLangValue) {
      document.documentElement.removeAttribute("lang");
    } else {
      document.documentElement.setAttribute("lang", htmlLang);
    }

    const frameId = window.requestAnimationFrame(() => {
      updateSnapshot();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [fontMode, htmlLang]);

  const sampleRows: SampleRow[] = [
    {
      key: "scope",
      name: "外层容器",
      font: snapshot.scope,
    },
    {
      key: "plainText",
      name: "纯文本",
      font: snapshot.plainText,
    },
    {
      key: "antdTypography",
      name: "Antd Typography",
      font: snapshot.antdTypography,
    },
    {
      key: "nativeInput",
      name: "原生 input",
      font: snapshot.nativeInput,
    },
    {
      key: "antdInput",
      name: "Antd Input",
      font: snapshot.antdInput,
    },
    {
      key: "nativeTextarea",
      name: "原生 textarea",
      font: snapshot.nativeTextarea,
    },
    {
      key: "antdTextarea",
      name: "Antd TextArea",
      font: snapshot.antdTextarea,
    },
    {
      key: "nativeButton",
      name: "原生 button",
      font: snapshot.nativeButton,
    },
    {
      key: "antdButton",
      name: "Antd Button",
      font: snapshot.antdButton,
    },
    {
      key: "nativeSelect",
      name: "原生 select",
      font: snapshot.nativeSelect,
    },
    {
      key: "antdSelectRoot",
      name: "Antd Select 外层",
      font: snapshot.antdSelectRoot,
    },
    {
      key: "antdSelectValue",
      name: "Antd Select 已选值",
      font: snapshot.antdSelectValue,
    },
  ];

  const selectLooksOdd =
    snapshot.antdSelectValue !== emptyFontValue &&
    snapshot.antdSelectValue !== snapshot.scope;

  return (
    <main
      style={{
        width: "100%",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <style>{demoCss}</style>
      <h1>Antd 6 Select font follow demo</h1>
      <p>
        目标：只留一个 <code>antd Select</code>，放大“外层 font”信号。
        如果它不跟随外层，肉眼应能直接看出。
      </p>

      <div>
        <span>
          {langOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setHtmlLang(option.value);
              }}
              style={{
                lineHeight: 1.5,
                marginRight: 5,
                border: "1px solid #d9d9d9",
                background:
                  htmlLang === option.value ? "#e6f4ff" : "transparent",
                cursor: "pointer",
              }}
            >
              {option.label}
            </button>
          ))}
        </span>
        <span>
          <span>当前 html lang: </span>
          <span>{htmlLang === noneLangValue ? "(未设置)" : htmlLang}</span>
        </span>
      </div>

      <section>
        <h2>焦点区</h2>
        <table
          ref={scopeRef}
          className={`demo-scope demo-scope-${fontMode}`}
        >
          <thead>
            <tr>
              <th align="left">类型</th>
              <th align="left">预览</th>
              <th align="left">font-family</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>纯文本</td>
              <td>
                <span ref={plainTextRef}>{sampleText}</span>
              </td>
              <td className="demo-font-note">{snapshot.plainText}</td>
            </tr>
            <tr className="demo-ant-row">
              <td>Antd Typography</td>
              <td>
                <div ref={antdTypographyRef}>
                  <Typography.Text>{sampleText}</Typography.Text>
                </div>
              </td>
              <td className="demo-font-note">{snapshot.antdTypography}</td>
            </tr>
            <tr>
              <td>原生 select</td>
              <td>
                <select
                  ref={nativeSelectRef}
                  className="demo-sample-select"
                  defaultValue="sample-1"
                >
                  {selectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="demo-font-note">{snapshot.nativeSelect}</td>
            </tr>
            <tr className="demo-ant-row">
              <td>Antd Select</td>
              <td>
                <div ref={antdSelectRef}>
                  <Select
                    defaultValue="sample-1"
                    options={selectOptions}
                    popupMatchSelectWidth={false}
                  />
                </div>
              </td>
              <td className="demo-font-note demo-font-note-alert">
                {snapshot.antdSelectValue}
              </td>
            </tr>
            <tr>
              <td>原生 input</td>
              <td>
                <input
                  ref={nativeInputRef}
                  className="demo-sample-input"
                  defaultValue={sampleText}
                />
              </td>
              <td className="demo-font-note">{snapshot.nativeInput}</td>
            </tr>
            <tr className="demo-ant-row">
              <td>Antd Input</td>
              <td>
                <div ref={antdInputRef}>
                  <Input value={sampleText} readOnly />
                </div>
              </td>
              <td className="demo-font-note">{snapshot.antdInput}</td>
            </tr>
            <tr>
              <td>原生 textarea</td>
              <td>
                <textarea
                  ref={nativeTextareaRef}
                  className="demo-sample-textarea"
                  defaultValue={sampleText}
                  rows={2}
                />
              </td>
              <td className="demo-font-note">{snapshot.nativeTextarea}</td>
            </tr>
            <tr className="demo-ant-row">
              <td>Antd TextArea</td>
              <td>
                <div ref={antdTextareaRef}>
                  <Input.TextArea value={sampleText} readOnly rows={2} />
                </div>
              </td>
              <td className="demo-font-note">{snapshot.antdTextarea}</td>
            </tr>
            <tr>
              <td>原生 button</td>
              <td>
                <button
                  ref={nativeButtonRef}
                  className="demo-sample-button"
                  type="button"
                >
                  {sampleText}
                </button>
              </td>
              <td className="demo-font-note">{snapshot.nativeButton}</td>
            </tr>
            <tr className="demo-ant-row">
              <td>Antd Button</td>
              <td>
                <div ref={antdButtonRef}>
                  <Button>{sampleText}</Button>
                </div>
              </td>
              <td className="demo-font-note">{snapshot.antdButton}</td>
            </tr>
          </tbody>
        </table>
      </section>


    </main>
  );
};

export default App;
