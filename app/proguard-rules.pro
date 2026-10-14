# Add project specific ProGuard rules here.
-keepattributes *Annotation*
-keepclassmembers class * {
    @org.jetbrains.annotations.* <fields>;
    @org.jetbrains.annotations.* <methods>;
}

# Keep Gemini and Firebase data models
-keep class com.exampulse.antigravity.model.** { *; }
-keep class com.google.ai.client.generativeai.** { *; }
