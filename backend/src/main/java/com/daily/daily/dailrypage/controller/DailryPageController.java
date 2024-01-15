package com.daily.daily.dailrypage.controller;

import com.daily.daily.common.dto.SuccessResponseDTO;
import com.daily.daily.dailrypage.dto.DailryPageDTO;
import com.daily.daily.dailrypage.dto.DailryPageUpdateDTO;
import com.daily.daily.dailrypage.service.DailryPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
//@RequestMapping("/api/dailry/{dailryID}/pages")
@RequestMapping("/api/pages")
public class DailryPageController {

    private final DailryPageService dailryPageService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DailryPageDTO createPage() {
        return dailryPageService.create();
    }

    @PatchMapping("/{pageId}")
    @ResponseStatus(HttpStatus.OK)
    public DailryPageDTO updatePage(@RequestBody DailryPageUpdateDTO dailryPageUpdateDTO, @PathVariable Long pageId) {
        return dailryPageService.update(pageId, dailryPageUpdateDTO);
    }

    @GetMapping("/{pageId}")
    @ResponseStatus(HttpStatus.OK)
    public DailryPageDTO findPage(@PathVariable Long pageId) {
        return dailryPageService.find(pageId);
    }

    @DeleteMapping("/{pageId}")
    @ResponseStatus(HttpStatus.OK)
    public SuccessResponseDTO deletePage(@PathVariable Long pageId) {
        dailryPageService.delete(pageId);
        return new SuccessResponseDTO(true, HttpStatus.OK.value());
    }
}
