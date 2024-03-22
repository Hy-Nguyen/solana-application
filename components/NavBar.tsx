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
          ACME
        </p>
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="center"
      >
        <NavbarItem>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href="#"
            aria-current="page"
            isBlock
          >
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href="/createToken"
          >
            Token
          </Link>
        </NavbarItem>
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
