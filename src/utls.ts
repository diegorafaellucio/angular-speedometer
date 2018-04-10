export class Utils2 {
    public static percToDeg(perc: number): number {
        return perc * 360;
    }

    public static percToRad(perc: number): number {
        let percToDegValue = this.percToDeg(perc);
        let degToRadValue = this.degToRad(percToDegValue);

        return degToRadValue;
    }

    public static degToRad(deg: number): number {
        return deg * Math.PI / 180;
    }
}