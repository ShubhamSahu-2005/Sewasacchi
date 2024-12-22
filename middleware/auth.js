import e from "express";
import { NextResponse } from "next/server";

export function authUser(request){

  console.log("MiddleWare Executed");
  const authToken=request.cookies.get("authToken")?.value;
  if(
    request.nextUrl.pathname==="/api/sendOtp"||
    request.nextUrl.pathname==='/api/verifyOtp'||
    request.nextUrl.pathname==="/api/users"||
    request.nextUrl.pathname==="/api/fundraiser"
  ){
    return;
  }
  const loggedInNotAccessPaths=
  request.nextUrl.pathname==="/api/sendOtp"||
  request.nextUrl.pathname==="/api/verifyOtp";

  if(loggedInNotAccessPaths){
    return NextResponse.redirect(new URL("/",request.url));

  }else{
    if(!authToken){
      if(request.nextUrl.pathname.startswith("/fundraiser")){
        return NextResponse.json(
          {
            message:"Please Login",
            success:false,
          },{
            status:401
          }
        );
        return NextResponse.redirect(new URL("/sendOtp",request.url))

      }
    }
  }
  console.log(authToken);
}
export const config={
  matcher:[
    "/",
    "/sendOtp",
    "/verifyOtp",
    "/fundraiser"

  ],
}