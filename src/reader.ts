import yaml from 'js-yaml';
import fs from 'fs';
import path from "path";
import { Feature } from './interfaces';

export function readYaml(pathDir: string): Feature[] {
    try {
        // Get document, or throw exception on error
        var doc = yaml.safeLoad(fs.readFileSync(path.resolve(process.cwd(), pathDir), 'utf8'));
        return doc;
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
}
