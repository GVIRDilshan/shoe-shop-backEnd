export class CustomerModel {
    constructor(
        cId,
        cName,
        gender,
        joinDate,
        level,
        totalPoints,
        birthday,
        contactNo,
        email,
        addressNoOrName,
        addressLane,
        addressCity,
        addressState,
        postalCode
    ) {

        this.cId = cId;
        this.cName = cName;
        this.gender = gender;
        this.joinDate = joinDate;
        this.level = level;
        this.totalPoints = totalPoints;
        this.birthday = birthday;
        this.contactNo = contactNo;
        this.email = email;
        this.addressNoOrName = addressNoOrName;
        this.addressLane = addressLane;
        this.addressCity = addressCity;
        this.addressState = addressState;
        this.postalCode = postalCode;

    }

}

