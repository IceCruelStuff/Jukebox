import * as fs from "fs";
import * as path from "path";

export class SimpleFileSystem{

    //TODO: Remade FS functions to get work right

    static fileExists(f){
        return fs.existsSync(f);
    }

    static dirExists(d){
        return this.fileExists(d);
    }

    static mkdir(d){
        return fs.mkdirSync(d);
    }

    static writeFile(p, data){
        return fs.writeFileSync(p, data);
    }

    static copy(s, d){
        return fs.copyFileSync(s, d);
    }

    static isDir(d){
        let stats = fs.statSync(d);
        return stats.isDirectory();
    }

    static isFile(p){
        let stats = fs.statSync(p);
        return stats.isFile();
    }

    static normalize(p){
        return path.normalize(p);
    }

    static basename(p){
        return path.basename(p);
    }

    static dirname(p){
        return path.dirname(p);
    }

    static getExtension(p){
        return path.extname(p).substr(1);
    }

    static getFileSize(p){
        let stats = fs.statSync(p);
        return stats.size;
    }

    static readFile(p){
        return fs.readFileSync(p);
    }

    static readDir(d){
        return fs.readdirSync(d);
    }

    static readFileAsStream(p){
        return fs.createReadStream(p);
    }

    static walkDir(d){
        d = path.normalize(d + path.sep);
        return fs.readdirSync(d).map(p => {return d + p;});
    }

    static createIfNotExists(p, c) {
        fs.appendFile(p, c, "utf8", function (err) {
            if (err) throw err;
        });
    }
}