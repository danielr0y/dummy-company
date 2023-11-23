import { PaginationProps } from "@/types/LeaveManager/pagination";
import { Link } from "@inertiajs/react";

export default function PaginationComponent ( {links}: PaginationProps ){

    return (
        <>
            {links.map( link => (
                <Link className={link.active ? "px-2 bg-slate-300 " : ""} key={link.value} href={link.url} dangerouslySetInnerHTML={{__html: link.label}} />
            ) )}
        </>
    );
}