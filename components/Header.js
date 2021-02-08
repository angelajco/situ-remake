export default function Header() {

    const enlaces = [
        { enlace: 'Trámites', },
        { enlace: 'Gobierno', },
    ]

    return (
        <div className="container-fluid tw-bg-inst-verde-fuerte tw-py-5">
            <div className="container">
                <ul className="tw-w-full tw-flex tw-justify-end tw-mb-0">
                    {
                        enlaces.map((link, index) => (
                            <li className="tw-px-4" key={index}>
                                <a href="#" className="tw-text-white tw-text-2xl tw-font-semibold hover:tw-text-inst-dorado hover:tw-no-underline">{link.enlace}</a>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}