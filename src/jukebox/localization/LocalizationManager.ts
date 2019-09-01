import * as FileSystem from "fs";

export class LocalizationManager {

    private languages: [] = [];
    private language: string = "en";

    constructor(lang: string){
        this.setLanguage(lang)
    }

    loadLanguages(): void {
        FileSystem.readdirSync(__dirname + "/languages/").forEach(file => {
            let fl = file.replace(".json", "");
            this.languages[fl] = JSON.parse(FileSystem.readFileSync(__dirname + "/languages/"+file).toString());
        });
    }

    setLanguage(lang: string): void{
        this.language = lang;
    }

    getPhrase(phrase: string): string {
        if(this.languages[this.language]["content"][phrase] !== null) {
            return this.languages[this.language]["content"][phrase];
        } else {
            return "MISSING " + this.language + " LANGUAGE PHRASE: " + phrase;
        }
    }
}