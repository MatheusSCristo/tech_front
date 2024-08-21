"use server"

import { cookies } from "next/headers";

async function deleteCookiesOnSignOut(){
    cookies().delete("access_token");
}

export default deleteCookiesOnSignOut;