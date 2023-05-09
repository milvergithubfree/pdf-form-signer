package uy.interfase.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uy.interfase.client.TspDemoIdasClient;
import uy.interfase.dto.TokenDto;


@RestController
@RequestMapping("/api/v1/authentication/token")
public class AuthenticationResource {

    @Value("${client.id}")
    private String clientId;

    @Value("${client.secret}")
    private String clientSecret;

    @Value("${scope}")
    private String scope;

    @Autowired
    private TspDemoIdasClient demoIdasClient;

    @GetMapping()
    public ResponseEntity<TokenDto> getToken() {

        ResponseEntity<TokenDto> response = demoIdasClient.getToken("client_credentials", scope, clientId, clientSecret);

        return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
    }
}
