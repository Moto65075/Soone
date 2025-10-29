import android.os.Build

fun getPhoneModel(): String {
    val manufacturer = Build.MANUFACTURER
    val model = Build.MODEL

    return if (model.toLowerCase().startsWith(manufacturer.toLowerCase())) {
        capitalize(model)
    } else {
        "${capitalize(manufacturer)} ${model}"
    }
}

private fun capitalize(s: String?): String {
    if (s == null || s.isEmpty()) {
        return ""
    }
    val first = s[0]
    return if (Character.isUpperCase(first)) {
        s
    } else {
        Character.toUpperCase(first) + s.substring(1)
    }
}