import { serveDir } from "@std/http";

export default {
    handleRequest(req: Request){
       return serveDir(req);
    }
}