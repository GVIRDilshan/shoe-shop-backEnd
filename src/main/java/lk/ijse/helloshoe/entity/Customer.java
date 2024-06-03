package lk.ijse.helloshoe.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lk.ijse.helloshoe.entity.enums.Gender;
import lk.ijse.helloshoe.entity.enums.LoyaltyLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Customer {
    @Id
    private String cId;
    @JsonProperty("cName")
    private String cName;

    @Enumerated(EnumType.STRING)
    private Gender gender;
    @Temporal(TemporalType.DATE)
    private Date joinDate;

    @Enumerated(EnumType.STRING)
    private LoyaltyLevel level;

    private int totalPoints;
    @Temporal(TemporalType.DATE)
    private Date birthday;
    private String contactNo;

    @Column(unique = true)
    private String email;

    private String addressNoOrName;
    private String addressLane;
    private String addressCity;
    private String addressState;
    private String postalCode;

    @OneToMany(mappedBy = "customer" , cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    private List<Sale> saleList;

}
