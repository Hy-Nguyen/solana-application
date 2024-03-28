"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function NavBar() {
  return (
    <Navbar
      maxWidth="xl"
      className="dark
    "
    >
      <NavbarBrand>
        <p className="font-bold text-inherit">
          Hy
        </p>
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="center"
      >
        <NavbarItem>
          <Link color="foreground" href="/">
            Send Sol
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href="/createToken"
          >
            Create Token
          </Link>
        </NavbarItem>
        <NavbarItem></NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="">
          <WalletMultiButton className=" " />
        </NavbarItem>
        <NavbarItem></NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
