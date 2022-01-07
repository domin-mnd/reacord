import React from "react"
import { linkClass } from "../ui/components"
import { PopoverMenu } from "../ui/popover-menu"
import { AppLink } from "./app-link"
import { guideLinks } from "./guide-links"
import { mainLinks } from "./main-links"

export function MainNavigation() {
  return (
    <nav className="flex justify-between items-center h-16">
      <a href="/">
        <h1 className="text-3xl font-light">reacord</h1>
      </a>
      <div className="hidden md:flex gap-4">
        {mainLinks.map((link) => (
          <AppLink {...link} key={link.to} className={linkClass} />
        ))}
      </div>
      <div className="md:hidden" id="main-navigation-popover">
        <PopoverMenu>
          {mainLinks.map((link) => (
            <AppLink
              {...link}
              key={link.to}
              className={PopoverMenu.itemClass}
            />
          ))}
          <hr className="border-0 h-[2px] bg-black/50" />
          {guideLinks.map((link) => (
            <AppLink
              {...link}
              key={link.to}
              className={PopoverMenu.itemClass}
            />
          ))}
        </PopoverMenu>
      </div>
    </nav>
  )
}