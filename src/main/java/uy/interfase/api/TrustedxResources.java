package uy.interfase.api;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import uy.interfase.client.TspDemoIdasClient;
import uy.interfase.dto.TokenDto;

@RestController
@RequestMapping("/api/v1/trustedx-resources/esignsp")
public class TrustedxResources {

    @Value("${client.id}")
    private String clientId;

    @Value("${client.secret}")
    private String clientSecret;

    @Value("${scope}")
    private String scope;

    @Autowired
    private TspDemoIdasClient demoIdasClient;

    @PostMapping("/signer_processes")
    public ResponseEntity<Object> signerProcesses(@RequestParam("process") MultipartFile process,
                                                  @RequestParam("document") MultipartFile document) {
        ResponseEntity<TokenDto> response = demoIdasClient.getToken("client_credentials", scope, clientId, clientSecret);
        TokenDto responseDto = response.getBody();
        String token = String.format("%s %s", responseDto.getTokenType(), responseDto.getAccessToken());
        ResponseEntity<Object> responseCreateProcess = demoIdasClient.createSignerProcess(token, process, document);
        return new ResponseEntity<>(responseCreateProcess.getBody(), HttpStatus.OK);
    }
}
