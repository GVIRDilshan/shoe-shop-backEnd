package lk.ijse.helloshoe.api;

import jakarta.annotation.security.RolesAllowed;
import lk.ijse.helloshoe.dto.CustomerDTO;
import lk.ijse.helloshoe.exception.DuplicateException;
import lk.ijse.helloshoe.exception.NotFoundException;
import lk.ijse.helloshoe.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("api/v1/customer")
@CrossOrigin
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @GetMapping("/health")
    public String customerHealthCheck() {
        return "Customer OK";

    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerDTO> saveCustomer(@RequestBody CustomerDTO customerDTO) {
        try {
//            System.out.println(customerDTO);
            customerService.saveCustomer(customerDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(customerDTO);

        } catch (DuplicateException duplicateException){
//            System.out.println(duplicateException.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

        }

    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());

    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerDTO> getCustomer(@PathVariable("id") String cId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(customerService.getCustomer(cId));

        } catch (NotFoundException notFoundException) {
            System.out.println(notFoundException.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

        }

    }

    @RolesAllowed("ADMIN")
    @ResponseStatus(HttpStatus.CREATED)
    @PutMapping(value = "{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerDTO> updateCustomer(@RequestBody CustomerDTO customerDTO, @PathVariable("id") String cId) {
        customerDTO.setCId(cId);

        try {
            customerService.updateCustomer(customerDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(customerDTO);

        } catch (NotFoundException | DuplicateException exception ) {
            System.out.println(exception);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

        }

    }

    @RolesAllowed("ADMIN")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping(value = "{id}")
    public ResponseEntity<CustomerDTO> deleteCustomer(@PathVariable("id") String cId) {
        try {
            customerService.deleteCustomer(cId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);

        } catch (NotFoundException notFoundException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

        }

    }



}
