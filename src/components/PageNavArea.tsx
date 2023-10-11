import React, {JSX} from "react";
import "../styles/pageNavArea.scss";

export function PageNavArea(props: {pageCount: number}): JSX.Element {
    const links: JSX.Element[] = [];

    for (let i = 0; i < props.pageCount; i++) {
        const url: URL = new URL(document.URL);
        url.searchParams.set("page", (i + 1).toString());

        links.push((
            <a className="pageNavLink" key={i} href={url.toString()}>{i + 1}</a>
        ));
    }

    return (
        <nav className="pageNavArea">{links}</nav>
    );
}