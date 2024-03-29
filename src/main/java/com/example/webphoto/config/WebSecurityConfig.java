package com.example.webphoto.config;

import com.example.webphoto.dto.TokenExceptionResponse;
import com.example.webphoto.service.JWTokenProvider;
import com.example.webphoto.service.UserDetailsServiceImpl;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
@Configuration
public class WebSecurityConfig {

    private final JWTokenProvider tokenProvider;

    @Bean
    @Order(1)
    SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http
                // API 경로에 대한 보안 설정
                .securityMatcher("/api/**")
                .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화
                .authorizeHttpRequests(authorize ->
                        authorize
                                // 특정 API 경로에 대해 인증 없이 허용
                                .requestMatchers("/api/join", "/api/signin", "/api/token", "api/hello","api/mailSend", "api/mailauthCheck").permitAll()
                                // 그 외의 모든 요청은 인증이 필요함
                                .anyRequest().authenticated()
                )
                // 세션 관리를 STATELESS로 설정 (토큰 기반 인증에서는 세션을 사용하지 않음)
                .sessionManagement((sessionManagement) ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // TokenAuthenticationFilter를 UsernamePasswordAuthenticationFilter 앞에 추가
                .addFilterBefore(new TokenAuthenticationFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class)
                // 예외 처리를 위한 핸들러 설정
                .exceptionHandling((exceptions) ->
                        exceptions
                                .authenticationEntryPoint(jwtException()));
        return http.build();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        return http
                .authorizeHttpRequests(requests ->
                        requests
                                .requestMatchers(HttpMethod.GET, "/css/**", "/js/**", "/images/**", "/uploads/**").permitAll() // static files
                                .requestMatchers("/signin", "/signout", "/join", "/").permitAll() // All method
                                .anyRequest().authenticated())
                .formLogin(login ->
                        login
                                .loginPage("/")
                                .defaultSuccessUrl("/memos")
                                .failureForwardUrl("/"))
                .logout(logout ->
                        logout
                                .logoutUrl("/signout")
                                .logoutSuccessUrl("/")
                                .invalidateHttpSession(true))
                .build();
    }

    @Bean
    AuthenticationManager authenticationManager(
            UserDetailsServiceImpl userDetailsService,
            BCryptPasswordEncoder bCryptPasswordEncoder
    ) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(bCryptPasswordEncoder);

        return new ProviderManager(authenticationProvider);
    }

    @Bean
    BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }



    // 401, 403 Error Handler
    private AuthenticationEntryPoint jwtException() {

        AuthenticationEntryPoint ap =  (request, response, authException)->{

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            TokenExceptionResponse res = new TokenExceptionResponse();

            String message = (String) request.getAttribute("TokenException");
            if(message!=null) { // UnAuthenticated
                response.setStatus(401);
                res.setResult(message);
            }
            else {
                response.setStatus(403);
                res.setResult(authException.getMessage());
            }
            Gson gson = new Gson();
            response.getWriter().write(gson.toJson(res));
        };
        return ap;
    }
}