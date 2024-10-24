import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";

interface DiscountsModalProps
{
    isOpen: boolean;
    onClose: () => void;
}

export default function DiscountsModal(props: DiscountsModalProps)
{
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} scrollBehavior={"inside"} size={"xl"}>
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader>
                            <h2 className={"text-3xl"}>Discounts</h2>
                        </ModalHeader>
                        <ModalBody>
                            <h2 className={"text-xl font-bold"}>Special Discounts</h2>
                            <ul>
                                <li><span className="text-primary">10%</span> off Solo &amp; Jotul Fire Pits / Stoves</li>
                                <li><span className="text-primary">20%</span> off Roofing Shingles</li>
                            </ul>
                            <h2 className={"text-xl font-bold"}>Apple Products</h2>
                            <ul>
                                <li><span className="text-primary font-bold">20%</span> off Apple Accessories <i>(keypads, wires, charging docs, etc.)</i></li>
                                <li><span className="text-primary font-bold">No Discounts</span> for Apple Airpods</li>
                                <li><span className="text-primary font-bold">No Discounts</span> for Apple Devices</li>
                                <li><span className="text-primary font-bold">No Discounts</span> for Apple Computers</li>
                                <li><span className="text-primary font-bold">No Discounts</span> for Apple iPads</li>
                                <li><span className="text-primary font-bold">No Discounts</span> for Apple iPhones</li>
                                <li><span className="text-primary font-bold">No Discounts</span> for Apple Watches</li>
                            </ul>
                            <h2 className={"text-xl font-bold"}>Appliances &amp; Power Tools</h2>
                            <ul>
                                <li><span className="text-primary font-bold">10%</span> off Major Appliances</li>
                                <li><span className="text-primary font-bold">10%</span> off Gas Power Tools</li>
                                <li><span className="text-primary font-bold">10%</span> off Air Conditioners</li>
                            </ul>
                            <h2 className={"text-xl font-bold"}>Electronics</h2>
                            <ul>
                                <li><span className="text-primary font-bold">10%</span> off Computers</li>
                                <li><span className="text-primary font-bold">10%</span> off Laptops</li>
                                <li><span className="text-primary font-bold">10%</span> off TV's</li>
                                <li><span className="text-primary font-bold">10%</span> off Stereos</li>
                                <li><span className="text-primary font-bold">10%</span> off Game Systems</li>
                                <li><span className="text-primary font-bold">10%</span> off Digital Cameras</li>
                            </ul>
                            <h2 className={"text-xl font-bold"}>Household</h2>
                            <ul>
                                <li><span className="text-primary font-bold">No Discount</span> for Paper Towels</li>
                                <li><span className="text-primary font-bold">No Discount</span> for Bathroom &amp; Facial Tissues</li>
                                <li><span className="text-primary font-bold">No Discount</span> for Laundry Detergent</li>
                                <li><span className="text-primary font-bold">No Discount</span> for Diapers</li>
                            </ul>
                            <h2 className={"text-xl font-bold"}>Firearms</h2>
                            <ul>
                                <li><span className="text-primary font-bold">No Discount</span> for Guns ∧ Rifles</li>
                                <li><span className="text-primary font-bold">No Discount</span> for Ammo</li>
                            </ul>
                            <h2 className={"text-xl font-bold"}>Food</h2>
                            <p><span className="text-primary font-bold">No Discounts</span> for any Food, Drink or Snack products</p>
                            <h2 className={"text-xl font-bold"}>Misc</h2>
                            <ul>
                                <li><span className="text-primary font-bold">No Discounts</span> for Live Plants or Flowers</li>
                                <li><span className="text-primary font-bold">No Discounts</span> for Flooring Installation</li>
                            </ul>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>

        </Modal>
    );
}