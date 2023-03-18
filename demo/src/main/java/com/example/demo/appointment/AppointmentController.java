package com.example.demo.appointment;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;

@RestController
@RequestMapping(value = "/api/v1/appointment")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @ModelAttribute
    public void setResponseHeader(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
    }
    record createNewAppReqbod(
         Timestamp bookingTime,
         int patientId,
         String doctorId,
         Timestamp startTime,
         Timestamp endTime,
         boolean isFollowup,
         boolean markForFollowup,
         String status,
         String description
    ){}
    record setMarkForFollowupReqbod(Integer appId, Boolean value){}
    record setStatusReqbod(Integer appId, String value){}
    record setTimeReqbod(Integer appId, Timestamp value){}

    public AppointmentController(AppointmentService appointmentService)
    {
        this.appointmentService = appointmentService;
    }

    @CrossOrigin
    @PostMapping("/create_appointment")
    public Appointment createAppointment(@RequestBody createNewAppReqbod reqbod) {
        Appointment newAppointment = appointmentService.createAppointment(reqbod.bookingTime, reqbod.patientId, reqbod.doctorId, reqbod.startTime, reqbod.endTime, reqbod.isFollowup, reqbod.markForFollowup, reqbod.status, reqbod.description);
        return newAppointment;
    }
    @CrossOrigin
    @PostMapping("/set_mark_for_followup")
    public boolean setMarkForFollowup(@RequestBody setMarkForFollowupReqbod req_bod) {
        boolean success = appointmentService.setMarkForFollowup(req_bod.appId, req_bod.value);
        return success;
    }

    @CrossOrigin
    @PostMapping("/set_status")
    public boolean setStatus(@RequestBody setStatusReqbod req_bod) {
        boolean success = appointmentService.setStatus(req_bod.appId, req_bod.value);
        return success;
    }

    @CrossOrigin
    @PostMapping("/set_start_time")
    public boolean setStartTime(@RequestBody setTimeReqbod req_bod) {
        boolean success = appointmentService.setStartTime(req_bod.appId, req_bod.value);
        return success;
    }

    @CrossOrigin
    @PostMapping("/set_end_time")
    public boolean setEndTime(@RequestBody setTimeReqbod req_bod) {
        boolean success = appointmentService.setEndTime(req_bod.appId, req_bod.value);
        return success;
    }

}
