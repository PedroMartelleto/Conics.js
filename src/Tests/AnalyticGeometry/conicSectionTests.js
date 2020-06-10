import ConicSection from "../../AnalyticGeometry/ConicSection"

export default function conicSectionTests() {
    describe('ConicSection', () => {
        it('eliminates linear conics terms', () => {
            const section = new ConicSection(4, -4, 7, 12, 6, -9);

            section.simplifyLinearTerms();

            expect(section.a).toBeCloseTo(4);
            expect(section.b).toBeCloseTo(-4);
            expect(section.c).toBeCloseTo(7);
            expect(section.d).toBeCloseTo(0);
            expect(section.e).toBeCloseTo(0);
            expect(section.f).toBeCloseTo(-24);

            const section2 = new ConicSection(16, -24, 9, -85, -30, 175);

            section2.simplifyLinearTerms();

            expect(section2.a).toBeCloseTo(16);
            expect(section2.b).toBeCloseTo(-24);
            expect(section2.c).toBeCloseTo(9);
            expect(section2.d).toBeCloseTo(-85);
            expect(section2.e).toBeCloseTo(-30);
            expect(section2.f).toBeCloseTo(175);
        });

        it('eliminates linear and mixed conics terms', () => {
            const section = new ConicSection(4, -4, 7, 12, 6, -9);
            
            section.simplify();

            expect(section.a).toBeCloseTo(3);
            expect(section.b).toBeCloseTo(0);
            expect(section.c).toBeCloseTo(8);
            expect(section.d).toBeCloseTo(0);
            expect(section.e).toBeCloseTo(0);
            expect(section.f).toBeCloseTo(-24);
            
            const section2 = new ConicSection(16, -24, 9, -85, -30, 175);

            section2.simplify();

            expect(section2.a).toBeCloseTo(0);
            expect(section2.b).toBeCloseTo(0);
            expect(section2.c).toBeCloseTo(25);
            expect(section2.d).toBeCloseTo(-75);
            expect(section2.e).toBeCloseTo(50);
            expect(section2.f).toBeCloseTo(175);
        });
    });
}