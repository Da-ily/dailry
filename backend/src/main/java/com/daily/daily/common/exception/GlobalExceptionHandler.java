package com.daily.daily.common.exception;

import com.daily.daily.common.dto.CommonResponseDTO;
import com.daily.daily.member.exception.DuplicatedNicknameException;
import com.daily.daily.member.exception.DuplicatedUsernameException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonResponseDTO> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        final String defaultMessage = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();

        log.warn(defaultMessage);

        return ResponseEntity.badRequest()
                .body(new CommonResponseDTO(defaultMessage, HttpStatus.BAD_REQUEST.value()));
    }

    @ExceptionHandler({DuplicatedUsernameException.class,
            DuplicatedNicknameException.class})
    public ResponseEntity<CommonResponseDTO> handleDuplicatedDateException(IllegalArgumentException e) {
        return new ResponseEntity<>(new CommonResponseDTO(e.getMessage(), HttpStatus.CONFLICT.value()), HttpStatus.CONFLICT);
    }
}
