import { Component, Context, Screen, Version } from "@zeplin/extension-model";

import project from "./project.json";
import screensData from "./screens.json";
import componentsData from "./components.json";
import versionData from "./version.json";
import { zeplin } from "../../package.json";

type Options = Record<string, number | boolean | string>;

const defaultOptions: Options = zeplin.options.reduce((options: Options, option) => {
    options[option.id] = option.default;
    return options;
}, {});


export const context = new Context({ project, options: defaultOptions });
export const version = new Version(versionData as unknown as any);
export const screens = screensData.map(data => new Screen(data));
export const components = componentsData.map(data => new Component(data as unknown as any));
