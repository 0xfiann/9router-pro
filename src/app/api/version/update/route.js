import { NextResponse } from "next/server";

// The npm updater is disabled in this fork. Updates ship as git deployments
// from this repo, never as `npm i -g` installs from a registry package, so
// this endpoint always answers 410 Gone.
export async function POST() {
  return NextResponse.json(
    { success: false, message: "The npm updater is disabled in this fork. Deploy from git instead." },
    { status: 410 }
  );
}
