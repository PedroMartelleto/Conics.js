import Ellipse from "./Ellipse";

export default class Circle extends Ellipse {
    static fromConicSection(conicSection) {
        return Ellipse.fromConicSection(conicSection);
    }
}